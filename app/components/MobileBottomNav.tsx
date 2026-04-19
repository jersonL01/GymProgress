"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dumbbell, User } from "lucide-react";

const items = [
    {
        href: "/home",
        label: "Entrenamiento",
        icon: Dumbbell,
    },
    {
        href: "/perfil",
        label: "Perfil",
        icon: User,
    },
];

export default function MobileBottomNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#0B0F14]/85 backdrop-blur-xl">
            <div className="mx-auto flex h-20 w-full max-w-md items-center justify-around px-4 sm:max-w-2xl lg:max-w-4xl">
                {items.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex min-w-[120px] flex-col items-center justify-center gap-1 rounded-2xl px-4 py-2 transition ${isActive
                                    ? "bg-cyan-400/10 text-cyan-300"
                                    : "text-white/45 hover:text-white/80"
                                }`}
                        >
                            <Icon
                                size={22}
                                className={isActive ? "opacity-100" : "opacity-80"}
                            />
                            <span className="text-xs font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}