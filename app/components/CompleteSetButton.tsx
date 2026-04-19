"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
    setId: string;
};

export default function CompleteSetButton({ setId }: Props) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleToggle() {
        try {
            setLoading(true);

            await fetch(`/api/routine-sets/${setId}/toggle`, {
                method: "PATCH",
            });

            router.refresh();
        } catch (error) {
            console.error(error);
            alert("No se pudo marcar la serie");
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            onClick={handleToggle}
            disabled={loading}
            className="flex h-[44px] w-[44px] items-center justify-center rounded-[14px] bg-[#BFC3C8] text-xl text-white disabled:opacity-60"
        >
            ✓
        </button>
    );
}