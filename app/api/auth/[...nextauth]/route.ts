import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        usuario: { label: "Usuario", type: "text" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        const usuario = String(credentials?.usuario ?? "").trim().toLowerCase();
        const password = String(credentials?.password ?? "");

        if (!usuario || !password) return null;

        const user = await prisma.user.findUnique({
          where: { username: usuario },
        });

        if (!user) return null;

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;

        // Lo que retorna aquí queda como "user" en la sesión JWT
        return { id: user.id, name: user.username };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };