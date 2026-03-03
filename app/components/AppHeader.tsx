import Image from "next/image";
import Link from "next/link";

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-white/[0.04] backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <div className="flex items-center gap-3">
          
        <div className="relative h-17 w-20 overflow-hidden rounded-2xl bg-black/20 ring-1 ring-white/10">
        <Image
          src="/iconGym.png"
          alt="GymRat"
          fill
          priority
          className="object-contain scale-[1.8] "
        />
      </div>

          <div className="leading-tight">
          
            <p className="text-sm font-extrabold text-white">GymRat</p>
            <p className="mt-1 text-sm text-white/70">
              Guarda tus pesos y mira tu progreso.
            </p>
          </div>
        </div>

        {/* Opcional: links rápidos */}
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