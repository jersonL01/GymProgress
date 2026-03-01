"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
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
    <main className="min-h-screen bg-neutral-50">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900">
              Iniciar sesión
            </h1>
            <p className="mt-1 text-sm text-neutral-600">
              Entra para guardar y ver tu progreso.
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-3">
            <div>
              <label className="text-sm font-semibold text-neutral-800">
                Usuario
              </label>
              <input
                type="text"
                autoComplete="username"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                placeholder="Tu usuario"
                className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:border-neutral-400"
                required
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-neutral-800">
                Contraseña
              </label>

              <div className="mt-1 flex items-center gap-2">
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:border-neutral-400"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="shrink-0 rounded-xl border bg-white px-3 py-2 text-sm font-semibold text-neutral-900 shadow-sm transition hover:bg-neutral-50"
                  aria-pressed={showPassword}
                >
                  {showPassword ? "Ocultar" : "Ver"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800 disabled:opacity-60"
            >
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>

          <div className="mt-5 flex items-center justify-between text-sm">
            <Link
              href="/register"
              className="font-semibold text-neutral-900 hover:underline"
            >
              Crear cuenta →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}