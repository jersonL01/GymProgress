"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
    setId: string;
    initialKg: number | null;
    initialReps: number | null;
    field: "kg" | "reps";
};

export default function UpdateLiveSetForm({
    setId,
    initialKg,
    initialReps,
    field,
}: Props) {
    const router = useRouter();

    const initialValue =
        field === "kg"
            ? initialKg !== null && initialKg !== undefined
                ? String(initialKg)
                : ""
            : initialReps !== null && initialReps !== undefined
                ? String(initialReps)
                : "";

    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    async function updateValue(newValue: string) {
        const payload =
            field === "kg"
                ? { targetKg: newValue ? Number(newValue) : null }
                : { targetReps: newValue ? Number(newValue) : null };

        await fetch(`/api/routine-sets/${setId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        router.refresh();
    }

    return (
        <input
            type="number"
            step={field === "kg" ? "0.5" : "1"}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={(e) => updateValue(e.target.value)}
            className="w-full rounded-[12px] bg-white/5 px-2 py-2 text-center text-lg text-white outline-none ring-1 ring-white/10 focus:ring-[#1693FF]"
        />
    );
}