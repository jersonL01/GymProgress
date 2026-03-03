import Link from "next/link";

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-white/[0.04] backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5">
              <span className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_0_6px_rgba(59,130,246,0.15)]" />
            </div>

            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">
                GymRat
              </h1>
              <p className="mt-1 text-sm text-white/70">
                Guarda tus pesos y mira tu progreso.
              </p>
            </div>
          </div>
        </div>

        {/* Opcional: links rápidos (si quieres) */}
        {/* 
        <nav className="hidden items-center gap-2 sm:flex">
          <Link
            href="/home"
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/10"
          >
            Home
          </Link>
          <Link
            href="/progres"
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/10"
          >
            Progreso
          </Link>
        </nav>
        */}
      </div>
    </header>
  );
}