"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { loginAction, type LoginState } from "@/lib/portal-actions";

const initialState: LoginState = { error: null, email: "" };

const inputClass =
  "mt-1.5 block w-full rounded-lg border border-saffron-200 bg-white px-3.5 py-2.5 text-base text-ink shadow-sm outline-none transition-colors placeholder:text-ink-soft/60 focus:border-saffron-500 focus:ring-2 focus:ring-saffron-500/30 aria-[invalid=true]:border-red-400";

export default function PortalLoginForm({ portal }: { portal: string }) {
  const [state, formAction, pending] = useActionState(loginAction, initialState);
  const hasError = Boolean(state.error);
  const errorRef = useRef<HTMLParagraphElement>(null);
  const [showPassword, setShowPassword] = useState(false);

  // After a failed submit, move focus to the message so keyboard and
  // screen-reader users land on it. `state` is a new object per submit, so a
  // repeated identical error is focused again too.
  useEffect(() => {
    if (state.error) errorRef.current?.focus();
  }, [state]);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="portal" value={portal} />

      {state.error && (
        <p
          ref={errorRef}
          id="login-error"
          role="alert"
          tabIndex={-1}
          className="rounded-lg border-l-4 border-red-500 bg-red-50 px-4 py-3 text-sm font-medium text-red-800"
        >
          {state.error}
        </p>
      )}

      <div>
        <label htmlFor="login-email" className="block text-sm font-semibold text-ink">
          Email
        </label>
        <input
          id="login-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="username"
          required
          maxLength={254}
          defaultValue={state.email}
          aria-invalid={hasError || undefined}
          aria-describedby={hasError ? "login-error" : undefined}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="login-password" className="block text-sm font-semibold text-ink">
          Password
        </label>
        <div className="relative">
          <input
            id="login-password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            maxLength={128}
            aria-invalid={hasError || undefined}
            aria-describedby={hasError ? "login-error" : undefined}
            className={`${inputClass} pr-12`}
          />
          {/* Show / hide password. */}
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            aria-controls="login-password"
            className="absolute inset-y-0 right-0 mt-1.5 flex w-11 items-center justify-center rounded-r-lg text-ink-soft transition-colors hover:text-saffron-700"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
              <circle cx="12" cy="12" r="3" />
              {showPassword && <path d="M3 3l18 18" />}
            </svg>
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        aria-disabled={pending}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-saffron-500 px-6 py-3 font-semibold text-ink shadow-lg shadow-saffron-500/25 transition-colors hover:bg-saffron-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-saffron-600 disabled:cursor-wait disabled:opacity-70"
      >
        {pending && (
          <span
            aria-hidden
            className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
          />
        )}
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
