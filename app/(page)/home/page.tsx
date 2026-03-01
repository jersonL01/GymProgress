import AppHeader from "@/app/components/AppHeader";
import HomeActions from "@/app/components/HomeActions";
import ExercisesList from "@/app/components/ExcercisesList";
import StatCard from "@/app/components/StatCard";
import LogoutButton from "@/app/components/LogoutButton";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-neutral-50">
      <AppHeader />

      <section className="mx-auto max-w-6xl px-4 py-8">
        {/* Top bar */}
        <div className="flex items-center justify-end">
          <LogoutButton />
        </div>

        {/* Acciones principales */}
        <HomeActions />

        {/* Stats */}
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <StatCard label="Ejercicios" value="0" />
          <StatCard label="Registros" value="0" />
          <StatCard label="Mejor 1RM" value="—" />
        </div>

        {/* Lista de ejercicios */}
        <div className="mt-6">
          <ExercisesList />
        </div>
      </section>
    </main>
  );
}