import AppHeader from "@/app/components/AppHeader";
import HomeActions from "@/app/components/HomeActions";
import StatCard from "@/app/components/StatCard";
import LogoutButton from "@/app/components/LogoutButton";
import UserBadge from "@/app/components/UserBadge";
import ExerciseSummaryList from "@/app/components/ExerciseSummaryList";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0B0F14] text-white">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute -bottom-40 right-[-120px] h-[520px] w-[520px] rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.06),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.10),transparent_40%)]" />
      </div>

      <div className="relative">
        <AppHeader />

        <section className="mx-auto max-w-6xl px-4 py-8">
          {/* Top bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <UserBadge />
              <span className="hidden sm:inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                Gym Rat • Dashboard
              </span>
            </div>

            <LogoutButton />
          </div>

          <ExerciseSummaryList/>

          <div className="mt-6">
            <HomeActions />
          </div>
        </section>
      </div>
    </main>
  );
}