"use server";

import { getVisitorIp } from "@/lib/portal-auth";

// Server Action for the public registration form (/register). The browser
// never talks to the CMS: this action re-validates the input and saves it to
// the CMS `registrations` collection with the shared frontend key, forwarding
// the visitor IP so the CMS rate-limits per visitor (5 entries / 10 min).
// Never log the submitted personal data.

export type RegistrationField = "name" | "phone" | "occupation" | "address" | "email";
export type RegistrationValues = Record<RegistrationField, string>;

export type RegistrationState = {
  status: "idle" | "success" | "error";
  error: string | null;
  fieldErrors: Partial<Record<RegistrationField, string>>;
  values: RegistrationValues;
};

const CMS_URL = (process.env.CMS_URL || "http://localhost:3001").replace(/\/+$/, "");
const TIMEOUT_MS = 10_000;

const MAX_LENGTH: Record<RegistrationField, number> = { name: 120, phone: 20, occupation: 200, address: 500, email: 254 };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?\d{10,13}$/;

const MSG_INVALID = "कृपया लाल रंग में दिखाई गई जानकारी ठीक करें। (Please correct the highlighted fields.)";
const MSG_RATE_LIMITED = "बहुत अधिक प्रयास। कृपया कुछ देर बाद पुनः प्रयास करें। (Too many attempts. Please try again later.)";
const MSG_UNAVAILABLE = "अभी फ़ॉर्म जमा नहीं हो सका। कृपया कुछ देर बाद पुनः प्रयास करें। (The form could not be submitted right now. Please try again later.)";

const EMPTY: RegistrationValues = { name: "", phone: "", occupation: "", address: "", email: "" };

function text(formData: FormData, field: RegistrationField): string {
  const v = formData.get(field);
  if (typeof v !== "string") return "";
  // The address keeps its line breaks; every other field is one line.
  const clean = field === "address" ? v.replace(/[^\S\n]+/g, " ").replace(/\n{2,}/g, "\n") : v.replace(/\s+/g, " ");
  return clean.trim().slice(0, MAX_LENGTH[field]);
}

export async function submitRegistration(_prev: RegistrationState, formData: FormData): Promise<RegistrationState> {
  const values: RegistrationValues = {
    name: text(formData, "name"),
    phone: text(formData, "phone"),
    occupation: text(formData, "occupation"),
    address: text(formData, "address"),
    email: text(formData, "email").toLowerCase(),
  };

  // Honeypot: a hidden field real visitors never fill. Pretend success.
  const trap = formData.get("website");
  if (typeof trap === "string" && trap.trim()) return { status: "success", error: null, fieldErrors: {}, values: EMPTY };

  const phone = values.phone.replace(/[\s\-().]/g, "");
  const fieldErrors: RegistrationState["fieldErrors"] = {};
  if (!values.name) fieldErrors.name = "कृपया अपना नाम लिखें। (Please enter your name.)";
  if (!PHONE_RE.test(phone)) fieldErrors.phone = "कृपया सही फ़ोन नंबर लिखें। (Please enter a valid phone number.)";
  if (values.email && !EMAIL_RE.test(values.email)) fieldErrors.email = "कृपया सही ई मेल लिखें। (Please enter a valid email.)";
  if (Object.keys(fieldErrors).length > 0) return { status: "error", error: MSG_INVALID, fieldErrors, values };

  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "x-portal-client-ip": await getVisitorIp(),
  };
  const key = process.env.FRONTEND_API_KEY;
  if (key) headers["x-frontend-key"] = key;

  let res: Response;
  try {
    res = await fetch(`${CMS_URL}/api/registrations`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        name: values.name,
        phone,
        occupation: values.occupation || undefined,
        address: values.address || undefined,
        email: values.email || undefined,
      }),
      cache: "no-store",
      redirect: "manual",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (err) {
    console.warn(JSON.stringify({ event: "registration.unavailable", error: err instanceof Error ? err.name : "unknown" }));
    return { status: "error", error: MSG_UNAVAILABLE, fieldErrors: {}, values };
  }

  if (res.status === 429) return { status: "error", error: MSG_RATE_LIMITED, fieldErrors: {}, values };
  if (!res.ok) {
    console.warn(JSON.stringify({ event: "registration.failed", status: res.status }));
    return { status: "error", error: MSG_UNAVAILABLE, fieldErrors: {}, values };
  }
  return { status: "success", error: null, fieldErrors: {}, values: EMPTY };
}
