"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export const dynamic = "force-dynamic";

function LoginContent() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/home";

  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      usuario: usuario.trim(),
      password,
      callbackUrl,
    });

    setLoading(false);

    if (!res || res.error) {
      setError("Usuario/contraseña incorrectos.");
      return;
    }

    router.push(res.url ?? callbackUrl);
    router.refresh();
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0B0F14] text-white">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute -bottom-40 right-[-120px] h-[520px] w-[520px] rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.06),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.10),transparent_40%)]" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl">
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
                <span className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_0_6px_rgba(59,130,246,0.15)]" />
                Acceso seguro
              </div>

              <h1 className="mt-3 text-2xl font-extrabold tracking-tight">
                Iniciar sesión
              </h1>
              <p className="mt-1 text-sm text-white/70">
                Entra para guardar y ver tu progreso.
              </p>
            </div>

            {error && (
              <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-white/90">
                  Usuario
                </label>

                <div className="mt-2 flex items-center gap-2 rounded-xl border border-white/10 bg-black/30 px-3 py-2 transition focus-within:border-blue-500/60 focus-within:ring-4 focus-within:ring-blue-500/15">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5 text-white/60"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20 21a8 8 0 0 0-16 0" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>

                  <input
                    type="text"
                    autoComplete="username"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                    placeholder="Tu usuario"
                    className="w-full bg-transparent text-sm text-white placeholder:text-white/40 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-white/90">
                  Contraseña
                </label>

                <div className="mt-2 flex items-center gap-2 rounded-xl border border-white/10 bg-black/30 px-3 py-2 transition focus-within:border-blue-500/60 focus-within:ring-4 focus-within:ring-blue-500/15">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5 text-white/60"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M16 11V7a4 4 0 0 0-8 0v4" />
                    <rect x="5" y="11" width="14" height="10" rx="2" />
                  </svg>

                  <input
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-transparent text-sm text-white placeholder:text-white/40 outline-none"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="shrink-0 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/90 transition hover:bg-white/10"
                    aria-pressed={showPassword}
                  >
                    {showPassword ? "Ocultar" : "Ver"}
                  </button>
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-white/50">
                    Usa una contraseña segura.
                  </span>

                  <Link
                    href="/forgot-password"
                    className="text-xs font-semibold text-blue-300 hover:text-blue-200 hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group relative mt-1 w-full overflow-hidden rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_14px_40px_rgba(37,99,235,0.35)] transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="relative z-10">
                  {loading ? "Ingresando..." : "Ingresar"}
                </span>
                <span className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
                  <span className="absolute -left-24 top-0 h-full w-24 skew-x-[-20deg] bg-white/20 blur-md animate-[shine_1.2s_ease-in-out_infinite]" />
                </span>
              </button>

              <div className="flex items-center gap-3 pt-1">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-xs text-white/50">o</span>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              <div className="flex items-center justify-between text-sm">
                <Link
                  href="/register"
                  className="font-semibold text-white/90 hover:text-white hover:underline"
                >
                  Crear cuenta →
                </Link>
              </div>
            </form>
          </div>

          <p className="mt-6 text-center text-xs text-white/45">
            © {new Date().getFullYear()} • Gym Rat
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes shine {
          0% {
            transform: translateX(-140%);
          }
          100% {
            transform: translateX(520%);
          }
        }
      `}</style>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0B0F14]" />}>
      <LoginContent />
    </Suspense>
  );
}