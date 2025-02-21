
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import client from "./lib/db"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongoDBAdapter(client),
  providers: [Google],
  session: {
    strategy: "jwt"
  }
})