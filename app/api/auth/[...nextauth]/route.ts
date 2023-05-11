import NextAuth, {NextAuthOptions} from "next-auth"
import EmailProvider from "next-auth/providers/email"
import clientPromise from "@/lib/mongodb";
import {MongoDBAdapter} from "@next-auth/mongodb-adapter";

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      // maxAge: 24 * 60 * 60, // How long email links are valid for (default 24h)
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log(user, account, profile, email, credentials);
      return user.email === process.env.EMAIL1 || user.email === process.env.EMAIL2;
    }
  },
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };