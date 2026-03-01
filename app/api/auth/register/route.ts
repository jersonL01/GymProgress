import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));

  const usuario = String(body?.usuario ?? "").trim().toLowerCase();
  const password = String(body?.password ?? "");

  if (usuario.length < 3) {
    return NextResponse.json(
      { error: "El usuario debe tener al menos 3 caracteres." },
      { status: 400 }
    );
  }
  if (password.length < 6) {
    return NextResponse.json(
      { error: "La contraseña debe tener al menos 6 caracteres." },
      { status: 400 }
    );
  }

  const exists = await prisma.user.findUnique({ where: { username: usuario } });
  if (exists) {
    return NextResponse.json({ error: "Ese usuario ya existe." }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { username: usuario, passwordHash },
    select: { id: true, username: true, createdAt: true },
  });

  return NextResponse.json(user, { status: 201 });
}