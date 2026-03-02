import NextAuth, { type NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
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
        if (!user?.passwordHash) return null;

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;

        // ✅ importante: devolver id y name
        return { id: user.id, name: user.username, email: user.username };
      },
    }),
  ],
  pages: { signIn: "/login" },
  callbacks: {
    async jwt({ token, user }) {
      // ✅ guardar id en el token al iniciar sesión
      if (user?.id) (token as any).id = user.id;
      return token;
    },
    async session({ session, token }) {
      // ✅ exponer id en session.user
      (session.user as any).id = (token as any).id;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };