import type { CSSProperties, ReactNode } from "react";
import { mediaAlt, mediaUrl, type MediaRef } from "@/lib/cms";
import { langOf } from "@/lib/view-types";

// Renders CMS rich text (Lexical JSON from Payload) with the site's typography.
// Output is plain React elements (no dangerouslySetInnerHTML), so editor
// content cannot inject markup or scripts. Links are re-checked against the
// safe-link allowlist here even though the CMS validates them on save.

// ---- minimal Lexical types (only what we render) ---------------------------

interface LexicalNode {
  type?: string;
  children?: unknown[];
  [k: string]: unknown;
}

interface LinkFields {
  url?: string | null;
  newTab?: boolean | null;
  linkType?: "custom" | "internal" | null;
  doc?: { relationTo?: string; value?: unknown } | null;
}

/** Shape of a Payload rich text field value: `{ root: { children: [...] } }`. */
export type RichTextData = { root?: unknown; [k: string]: unknown };

// Same allowlist as the CMS link validator: /path (not //host or /\host),
// #anchor, http(s)://, mailto:, tel:.
const SAFE_LINK = /^(\/(?![\/\\])[^\s\\]*|#[\w-]*|https?:\/\/[^\s\\]+|mailto:[^\s\\]+|tel:[+\d\s()-]+)$/i;
const SAFE_IMG = /^(\/(?![\/\\])[^\s\\]*|https?:\/\/[^\s\\]+)$/i;
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

// Lexical text format bitmask.
const BOLD = 1;
const ITALIC = 2;
const STRIKETHROUGH = 4;
const UNDERLINE = 8;
const CODE = 16;
const SUBSCRIPT = 32;
const SUPERSCRIPT = 64;

const HEADING_TAGS = new Set(["h1", "h2", "h3", "h4", "h5", "h6"]);
const ALIGN = new Set(["left", "center", "right", "justify", "start", "end"]);

const isNode = (n: unknown): n is LexicalNode => typeof n === "object" && n !== null;

function blockStyle(node: LexicalNode): CSSProperties | undefined {
  const style: CSSProperties = {};
  if (typeof node.format === "string" && ALIGN.has(node.format)) {
    style.textAlign = node.format as CSSProperties["textAlign"];
  }
  if (typeof node.indent === "number" && node.indent > 0 && node.indent <= 10) {
    style.paddingInlineStart = `${node.indent * 2}rem`;
  }
  return Object.keys(style).length ? style : undefined;
}

/** All text in the tree (to pick the `lang` of the block). */
function plainText(node: LexicalNode): string {
  if (typeof node.text === "string") return node.text;
  return Array.isArray(node.children) ? node.children.map((c) => (isNode(c) ? plainText(c) : "")).join(" ") : "";
}

function renderChildren(node: LexicalNode): ReactNode[] {
  return Array.isArray(node.children) ? node.children.map((c, i) => renderNode(c, i)) : [];
}

function renderText(node: LexicalNode, key: number): ReactNode {
  const text = typeof node.text === "string" ? node.text : "";
  if (!text) return null;
  const format = typeof node.format === "number" ? node.format : 0;
  let out: ReactNode = text;
  if (format & CODE) out = <code>{out}</code>;
  if (format & SUBSCRIPT) out = <sub>{out}</sub>;
  if (format & SUPERSCRIPT) out = <sup>{out}</sup>;
  if (format & STRIKETHROUGH) out = <s>{out}</s>;
  if (format & UNDERLINE) out = <u>{out}</u>;
  if (format & ITALIC) out = <em>{out}</em>;
  if (format & BOLD) out = <strong>{out}</strong>;
  return <span key={key}>{out}</span>;
}

function linkHref(fields: LinkFields | undefined): string | null {
  if (!fields) return null;
  if (fields.linkType === "internal") {
    const doc = fields.doc;
    const value = doc?.value;
    const slug = isNode(value) && typeof value.slug === "string" ? value.slug : null;
    if (!slug || !SLUG.test(slug)) return null;
    if (doc?.relationTo === "pillars") return `/${slug}`;
    if (doc?.relationTo === "events") return `/blog/${slug}`;
    return null;
  }
  const url = typeof fields.url === "string" ? fields.url.trim() : "";
  return url && SAFE_LINK.test(url) ? url : null;
}

function renderLink(node: LexicalNode, key: number): ReactNode {
  const fields = isNode(node.fields) ? (node.fields as LinkFields) : undefined;
  const href = linkHref(fields);
  const children = renderChildren(node);
  if (!href) return <span key={key}>{children}</span>;
  return fields?.newTab ? (
    <a key={key} href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ) : (
    <a key={key} href={href}>
      {children}
    </a>
  );
}

function renderUpload(node: LexicalNode, key: number): ReactNode {
  const value = isNode(node.value) ? (node.value as unknown as MediaRef) : null;
  const src = mediaUrl(value);
  if (!src || !SAFE_IMG.test(src)) return null;
  const m = value as { width?: number | null; height?: number | null };
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      key={key}
      src={src}
      alt={mediaAlt(value)}
      width={m.width ?? undefined}
      height={m.height ?? undefined}
      loading="lazy"
      className="h-auto max-w-full rounded-lg"
    />
  );
}

function renderNode(raw: unknown, key: number): ReactNode {
  if (!isNode(raw)) return null;
  const node = raw;
  switch (node.type) {
    case "text":
      return renderText(node, key);
    case "linebreak":
      return <br key={key} />;
    case "tab":
      return <span key={key}>{"\t"}</span>;
    case "paragraph":
      return (
        <p key={key} style={blockStyle(node)}>
          {renderChildren(node)}
        </p>
      );
    case "heading": {
      const tag = typeof node.tag === "string" && HEADING_TAGS.has(node.tag) ? node.tag : "h2";
      const Tag = tag as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
      return (
        <Tag key={key} style={blockStyle(node)}>
          {renderChildren(node)}
        </Tag>
      );
    }
    case "list": {
      const Tag = node.listType === "number" ? "ol" : "ul";
      return <Tag key={key}>{renderChildren(node)}</Tag>;
    }
    case "listitem": {
      const checked = typeof node.checked === "boolean" ? node.checked : undefined;
      return (
        <li key={key} aria-checked={checked} role={checked === undefined ? undefined : "checkbox"}>
          {renderChildren(node)}
        </li>
      );
    }
    case "quote":
      return <blockquote key={key}>{renderChildren(node)}</blockquote>;
    case "horizontalrule":
      return <hr key={key} />;
    case "link":
    case "autolink":
      return renderLink(node, key);
    case "upload":
      return renderUpload(node, key);
    default: {
      // Unknown node: render its children (if any) so text is not lost.
      const children = renderChildren(node);
      return children.length ? <span key={key}>{children}</span> : null;
    }
  }
}

export default function RichText({
  data,
  className = "",
}: {
  data: RichTextData | null | undefined;
  className?: string;
}) {
  const root = data && isNode(data.root) ? data.root : null;
  if (!root) return null;
  return (
    <div
      lang={langOf(plainText(root))}
      className={`space-y-4 text-base leading-relaxed text-ink-soft [&_a]:font-medium [&_a]:text-sewablue-700 [&_a]:underline [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-ink [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-ink [&_li]:ml-5 [&_ol]:list-decimal [&_strong]:text-ink [&_ul]:list-disc ${className}`}
    >
      {renderChildren(root)}
    </div>
  );
}
