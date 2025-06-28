import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const res = await fetch("http://localhost/candidate_portal_api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        const data = await res.json();

        if (!res.ok || !data || !data.user) {
          throw new Error(data.message || "Invalid credentials");
        }

        return {
          id: data.user.recruiter_id,
          name: data.user.name,
          email: data.user.email,
          token: data.token,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.recruiter_id = user.id;
        token.token = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.recruiter_id = token.recruiter_id;
      session.user.token = token.token;
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  useSecureCookies: false, // ✅ for local development
  debug: true,
});

export { handler as GET, handler as POST };
