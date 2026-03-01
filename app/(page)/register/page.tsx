"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const u = usuario.trim().toLowerCase();
    if (u.length < 3) {
      setError("El usuario debe tener al menos 3 caracteres.");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario: u, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.error ?? "No se pudo registrar.");
        setLoading(false);
        return;
      }

      router.push("/login");
      router.refresh();
    } catch {
      setError("Error de red. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900">
              Crear cuenta
            </h1>
            <p className="mt-1 text-sm text-neutral-600">
              Registra tu usuario y contraseña.
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
                placeholder="ej: jerson123"
                className="mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:border-neutral-400"
                required
              />
              <p className="mt-1 text-xs text-neutral-500">
                Se recomienda usar minúsculas (mínimo 3 caracteres).
              </p>
            </div>

            {/* Contraseña + ver */}
            <div>
              <label className="text-sm font-semibold text-neutral-800">
                Contraseña
              </label>

              <div className="mt-1 flex items-center gap-2">
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
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

              <p className="mt-1 text-xs text-neutral-500">
                Mínimo 6 caracteres.
              </p>
            </div>

            {/* Confirmar + ver */}
            <div>
              <label className="text-sm font-semibold text-neutral-800">
                Confirmar contraseña
              </label>

              <div className="mt-1 flex items-center gap-2">
                <input
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:border-neutral-400"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="shrink-0 rounded-xl border bg-white px-3 py-2 text-sm font-semibold text-neutral-900 shadow-sm transition hover:bg-neutral-50"
                  aria-pressed={showConfirm}
                >
                  {showConfirm ? "Ocultar" : "Ver"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800 disabled:opacity-60"
            >
              {loading ? "Creando..." : "Crear cuenta"}
            </button>
          </form>

          <div className="mt-5 flex items-center justify-between text-sm">
            <Link
              href="/login"
              className="font-semibold text-neutral-900 hover:underline"
            >
              ← Volver al login
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}