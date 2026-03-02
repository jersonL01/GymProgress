"use client";

import { useSession } from "next-auth/react";

export default function UserBadge() {
  const { data, status } = useSession();

  const username =
    // lo que tú retornas en authorize: { name: user.username }
    data?.user?.name ?? "—";

  return (
    <div className="rounded-xl border bg-white px-3 py-2 text-sm font-semibold text-neutral-900 shadow-sm">
      {status === "loading" ? "Cargando..." : `Usuario: ${username}`}
    </div>
  );
}