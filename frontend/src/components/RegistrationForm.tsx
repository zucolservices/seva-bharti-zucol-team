"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import {
  submitRegistration,
  type RegistrationField,
  type RegistrationState,
} from "@/lib/registration-actions";

const initialState: RegistrationState = {
  status: "idle",
  error: null,
  fieldErrors: {},
  values: { name: "", phone: "", occupation: "", address: "", email: "" },
};

const inputClass =
  "mt-1.5 block w-full rounded-lg border border-saffron-200 bg-white px-3.5 py-2.5 text-base text-ink shadow-sm outline-none transition-colors placeholder:text-ink-soft/60 focus:border-saffron-500 focus:ring-2 focus:ring-saffron-500/30 aria-[invalid=true]:border-red-400";

type FieldConfig = {
  name: RegistrationField;
  labelHi: string;
  labelEn: string;
  required?: boolean;
  multiline?: boolean;
  input?: React.InputHTMLAttributes<HTMLInputElement>;
  maxLength: number;
};

// Fields in the order the client asked for: नाम, दूरभाष, कार्य व्यवसाय, पता, ई मेल.
const FIELDS: FieldConfig[] = [
  { name: "name", labelHi: "नाम", labelEn: "Name", required: true, maxLength: 120, input: { autoComplete: "name" } },
  {
    name: "phone",
    labelHi: "दूरभाष",
    labelEn: "Phone",
    required: true,
    maxLength: 20,
    input: { type: "tel", inputMode: "tel", autoComplete: "tel" },
  },
  { name: "occupation", labelHi: "कार्य व्यवसाय", labelEn: "Occupation", maxLength: 200, input: { autoComplete: "organization-title" } },
  { name: "address", labelHi: "पता", labelEn: "Address", multiline: true, maxLength: 500 },
  {
    name: "email",
    labelHi: "ई मेल",
    labelEn: "Email",
    maxLength: 254,
    input: { type: "email", inputMode: "email", autoComplete: "email" },
  },
];

export default function RegistrationForm() {
  const [state, formAction, pending] = useActionState(submitRegistration, initialState);
  // Bumped on "fill another" so the form remounts with empty fields.
  const [formKey, setFormKey] = useState(0);
  const [showForm, setShowForm] = useState(true);
  const errorRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);

  // Move focus to the result so keyboard and screen-reader users hear it.
  // `state` is a new object per submit, so a repeated error is focused again.
  useEffect(() => {
    if (state.status === "error") errorRef.current?.focus();
    if (state.status === "success") {
      setShowForm(false);
      doneRef.current?.focus();
    }
  }, [state]);

  if (!showForm) {
    return (
      <div
        ref={doneRef}
        role="status"
        tabIndex={-1}
        className="rounded-xl border border-green-200 bg-green-50 px-5 py-7 text-center outline-none"
      >
        <span aria-hidden className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-white">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </span>
        <p lang="hi" className="mt-4 text-balance text-lg font-bold leading-snug text-ink">
          धन्यवाद! आपकी जानकारी सहेज ली गई है।
        </p>
        <p className="mt-1 text-balance text-sm text-ink-soft">Thank you! Your details have been saved.</p>
        <button
          type="button"
          onClick={() => {
            setFormKey((k) => k + 1);
            setShowForm(true);
          }}
          className="mt-5 inline-flex flex-wrap items-baseline justify-center gap-x-1.5 rounded-lg border border-saffron-300 bg-white px-5 py-2.5 text-sm font-semibold text-saffron-700 transition-colors hover:bg-saffron-50"
        >
          <span lang="hi" className="whitespace-nowrap">एक और फ़ॉर्म भरें</span>
          <span className="whitespace-nowrap font-normal">(Fill another)</span>
        </button>
      </div>
    );
  }

  const values = state.status === "error" ? state.values : initialState.values;

  return (
    <form key={formKey} action={formAction} className="space-y-5" noValidate>
      {state.status === "error" && state.error && (
        <div
          ref={errorRef}
          id="registration-error"
          role="alert"
          tabIndex={-1}
          className="flex gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 outline-none"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="mt-0.5 shrink-0">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7.5v5.5M12 16.5h.01" />
          </svg>
          <p className="text-pretty">
            <span lang="hi" className="block font-semibold">{state.error.hi}</span>
            <span className="block">{state.error.en}</span>
          </p>
        </div>
      )}

      {/* Honeypot for bots: hidden from people and screen readers. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="registration-website">Website</label>
        <input id="registration-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {FIELDS.map((f) => {
        const id = `registration-${f.name}`;
        const error = state.status === "error" ? state.fieldErrors[f.name] : undefined;
        const common = {
          id,
          name: f.name,
          required: f.required,
          maxLength: f.maxLength,
          defaultValue: values[f.name],
          "aria-invalid": error ? true : undefined,
          "aria-describedby": error ? `${id}-error` : undefined,
          className: inputClass,
        };
        return (
          <div key={f.name}>
            {/* Each part stays on one line; the parts wrap as whole units on narrow screens. */}
            <label htmlFor={id} className="flex flex-wrap items-baseline gap-x-1.5 text-sm text-ink">
              <span lang="hi" className="whitespace-nowrap font-semibold">
                {f.labelHi}
                {f.required && (
                  <>
                    <span aria-hidden className="ml-0.5 text-red-600">*</span>
                    <span className="sr-only"> (आवश्यक / required)</span>
                  </>
                )}
              </span>
              <span className="whitespace-nowrap text-ink-soft">({f.labelEn})</span>
              {!f.required && (
                <span className="whitespace-nowrap text-xs text-ink-soft/80">
                  <span lang="hi">वैकल्पिक</span> · optional
                </span>
              )}
            </label>
            {f.multiline ? <textarea rows={3} {...common} /> : <input type="text" {...f.input} {...common} />}
            {error && (
              <p id={`${id}-error`} className="mt-1.5 flex flex-wrap gap-x-1.5 text-sm text-red-700">
                <span lang="hi" className="font-medium">{error.hi}</span>
                <span>{error.en}</span>
              </p>
            )}
          </div>
        );
      })}

      <button
        type="submit"
        disabled={pending}
        aria-disabled={pending}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-saffron-500 px-6 py-3 font-semibold text-ink shadow-lg shadow-saffron-500/25 transition-colors hover:bg-saffron-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-saffron-600 disabled:cursor-wait disabled:opacity-70"
      >
        {pending && (
          <span aria-hidden className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
        )}
        <span className="flex flex-wrap items-baseline justify-center gap-x-1.5">
          <span lang="hi">{pending ? "जमा हो रहा है…" : "जमा करें"}</span>
          <span className="font-normal">{pending ? "(Submitting…)" : "(Submit)"}</span>
        </span>
      </button>
    </form>
  );
}
