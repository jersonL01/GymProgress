import AppHeader from "@/app/components/AppHeader";
import HomeActions from "@/app/components/HomeActions";
import StatCard from "@/app/components/StatCard";

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-50">
      <AppHeader />

      <section className="mx-auto max-w-6xl px-4 py-10">
        <HomeActions />

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <StatCard label="Ejercicios" value="0" />
          <StatCard label="Registros" value="0" />
          <StatCard label="Mejor 1RM" value="—" />
        </div>
      </section>
    </main>
  );
}