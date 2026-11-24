"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff, Lock } from "lucide-react";

export default function LoginPage() {
  return (
    <main className="grid flex-1 place-items-center bg-purple-deep px-4 py-16">
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}

const messages: Record<string, string> = {
  wrong: "That password is not correct. Try again.",
  setup: "No counter password is set yet. Add ADMIN_PASSWORD in the hosting settings, then redeploy.",
};

function LoginForm() {
  const params = useSearchParams();
  const error = params.get("error");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);

  return (
    <form
      method="post"
      action="/api/admin/login"
      onSubmit={() => setBusy(true)}
      className="w-full max-w-sm rounded-2xl bg-white p-7 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)]"
    >
      <p className="display text-4xl leading-none text-purple-deep">EcoSpin</p>
      <p className="mt-1 font-semibold text-muted">Counter login</p>

      <input type="hidden" name="next" value={params.get("next") ?? "/admin"} />

      <label className="mt-6 block">
        <span className="mb-1 block text-sm font-semibold text-ink">Password</span>
        <span className="relative block">
          <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
          <input
            name="password"
            type={show ? "text" : "password"}
            autoComplete="current-password"
            required
            autoFocus
            className="w-full rounded-lg border border-lilac py-3 pr-11 pl-9 text-base focus:border-purple focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Hide password" : "Show password"}
            className="absolute top-1/2 right-2 -translate-y-1/2 p-1.5 text-muted"
          >
            {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </span>
      </label>

      {error && messages[error] && (
        <p role="alert" className="mt-3 text-sm font-semibold text-red-600">
          {messages[error]}
        </p>
      )}

      <button
        disabled={busy}
        className="mt-5 w-full rounded-xl bg-purple px-5 py-3.5 text-lg font-bold text-white hover:bg-purple-bright disabled:opacity-60"
      >
        {busy ? "Checking…" : "Open counter"}
      </button>
    </form>
  );
}
