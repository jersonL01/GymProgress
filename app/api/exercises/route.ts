import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const search = (searchParams.get("search") || "").trim();

        const exercises = await prisma.exercise.findMany({
            where: search
                ? {
                    OR: [
                        { name: { contains: search, mode: "insensitive" } },
                        { nameEs: { contains: search, mode: "insensitive" } },
                    ],
                }
                : {},
            orderBy: {
                nameEs: "asc",
            },
            take: 300,
            select: {
                id: true,
                name: true,
                nameEs: true,
                primaryMusclesEs: true,
                images: true,
            },
        });

        return NextResponse.json(exercises);
    } catch (error) {
        console.error("GET /api/exercises error:", error);
        return NextResponse.json(
            { error: "No se pudieron obtener los ejercicios" },
            { status: 500 }
        );
    }
}