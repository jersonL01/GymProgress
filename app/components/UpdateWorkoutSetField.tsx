"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
    setId: string;
    initialValue: number | null;
    field: "actualKg" | "actualReps";
};

export default function UpdateWorkoutSetField({
    setId,
    initialValue,
    field,
}: Props) {
    const router = useRouter();
    const [value, setValue] = useState(
        initialValue !== null && initialValue !== undefined ? String(initialValue) : ""
    );
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setValue(
            initialValue !== null && initialValue !== undefined ? String(initialValue) : ""
        );
    }, [initialValue]);

    async function handleBlur() {
        try {
            setSaving(true);

            const payload =
                field === "actualKg"
                    ? { actualKg: value ? Number(value) : null }
                    : { actualReps: value ? Number(value) : null };

            await fetch(`/api/workout-sets/${setId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            router.refresh();
        } catch (error) {
            console.error(error);
        } finally {
            setSaving(false);
        }
    }

    return (
        <input
            type="number"
            step={field === "actualKg" ? "0.5" : "1"}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={handleBlur}
            placeholder="-"
            className={`w-full rounded-xl bg-transparent px-1 py-2 text-center text-[20px] font-semibold text-white outline-none transition-all placeholder:text-text-dim/50 focus:bg-surface-200 focus:shadow-[inset_0_0_0_1.5px_var(--color-brand)] ${saving ? "opacity-50" : ""
                }`}
        />
    );
}