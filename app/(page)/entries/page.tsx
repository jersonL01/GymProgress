import ExercisesList from "@/app/components/ExcercisesList";

export default function EntriesPage() {
  return (
    <main className="min-h-screen bg-neutral-50">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-4 py-5">
          <h1 className="text-xl font-extrabold tracking-tight text-neutral-900 sm:text-2xl">
            Ejercicios
          </h1>
          <p className="mt-1 text-sm text-neutral-600">
            Selecciona un ejercicio para registrar tu entrenamiento.
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-8">
        <ExercisesList />
      </section>
    </main>
  );
}