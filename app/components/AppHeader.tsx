import Link from "next/link";

export default function AppHeader() {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-neutral-900 sm:text-2xl">
            GymRat
          </h1>
          <p className="mt-1 text-sm text-neutral-600">
            Guarda tus pesos y mira tu progreso.
          </p>
        </div>

      </div>
    </header>
  );
}