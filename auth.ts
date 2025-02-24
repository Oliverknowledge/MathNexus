import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import client from "./lib/db";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import mongoose from "mongoose";
import User from "@/models/user.models";
import { connectToDB } from "./lib/mongoose";
// ✅ Define NextAuthOptions with correct type import
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongoDBAdapter(client),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true, // ✅ Auto-links accounts
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: { async signIn({ user, account }) {
    await connectToDB();
    console.log("🔐 Sign in callback");
    const existingUser = await User.findOne({ email: user.email });
    if (!account) return false;
    if (!existingUser) {
      console.log("🆕 Creating new user");
      await User.create({
        email: user.email,
        name: user.name,
        image: user.image,
        solvedProblems: [],
      });
    } else {
      console.log(`🔗 Attempting to link ${account.provider} to existing user`);

      // Check if the account already exists in NextAuth's "accounts" collection
      const Accounts = mongoose.connection.db!.collection("accounts");
      const existingAccount = await Accounts.findOne({ userId: existingUser._id });

      if (!existingAccount) {
        console.log(`✅ No existing account found. Linking ${account.provider}`);

        // Manually create the account entry in NextAuth's "accounts" collection
        await Accounts.insertOne({
          userId: existingUser._id,
          provider: account.provider,
          type: account.type,
          providerAccountId: account.providerAccountId,
        });
      }
    }

    return true;
  },
  
}, 
});

