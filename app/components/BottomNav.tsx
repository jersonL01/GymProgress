"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dumbbell, User } from "lucide-react";

const items = [
    { href: "/home", label: "Inicio", icon: Dumbbell },
    { href: "/perfil", label: "Perfil", icon: User },
];

export default function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-border-subtle bg-bg-app/80 backdrop-blur-xl">
            <div className="mx-auto flex h-24 w-full max-w-md items-center justify-around px-4 pb-4">
                {items.map((item) => {
                    const active = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex min-w-[72px] flex-col items-center justify-center gap-1.5 transition-all ${active ? "scale-105" : "hover:text-white"}`}
                        >
                            <Icon
                                size={26}
                                className={`transition-colors ${active ? "text-brand" : "text-text-dim"}`}
                                strokeWidth={active ? 2.5 : 2}
                            />
                            <span
                                className={`text-[11px] font-medium tracking-wide transition-colors ${active ? "text-brand" : "text-text-dim"
                                    }`}
                            >
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}