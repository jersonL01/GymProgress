"use client";

import { useEffect, useState } from "react";

type Props = {
    startedAt: string;
};

export default function WorkoutTimer({ startedAt }: Props) {
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        function update() {
            const start = new Date(startedAt).getTime();
            const now = Date.now();
            setSeconds(Math.max(0, Math.floor((now - start) / 1000)));
        }

        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, [startedAt]);

    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return (
        <span className="mt-2 text-2xl text-[#1693FF]">
            {mins}m {secs}s
        </span>
    );
}