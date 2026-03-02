"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/90 shadow-sm transition hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5 text-white/70"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M16 17l5-5-5-5" />
        <path d="M21 12H9" />
        <path d="M12 19H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h7" />
      </svg>
      Cerrar sesión
    </button>
  );
}