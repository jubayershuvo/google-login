// lib/authOptions.ts
import type { NextAuthOptions } from "next-auth";
import GoogleProvider, { GoogleProfile } from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";
import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";

interface ExtendedToken extends JWT {
  accessToken?: string;
  refreshToken?: string;
  provider?: string;
  providerAccountId?: string;
}

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      accessToken?: string;
      refreshToken?: string;
      provider?: string;
      providerAccountId?: string;
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider<GoogleProfile>({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope:
            "openid email profile https://www.googleapis.com/auth/gmail.readonly",
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
  ],

  callbacks: {
    async jwt({ token, account }): Promise<ExtendedToken> {
      const extendedToken: ExtendedToken = { ...token };

      if (account) {
        extendedToken.accessToken = account.access_token;
        extendedToken.refreshToken = account.refresh_token;
        extendedToken.provider = account.provider;
        extendedToken.providerAccountId = account.providerAccountId;
      }

      return extendedToken;
    },

    async session({ session, token }) {
      const extendedToken = token as ExtendedToken;

      if (session.user) {
        session.user.accessToken = extendedToken.accessToken;
        session.user.refreshToken = extendedToken.refreshToken;
        session.user.provider = extendedToken.provider;
        session.user.providerAccountId = extendedToken.providerAccountId;
      }

      return session;
    },
    async redirect({ url, baseUrl }) {
    return baseUrl; // always go to "/"
  },
  },

  events: {
    async signIn({ account, user }) {
      try {
        await connectDB();

        if (!account?.provider || !user?.email) return;

        const existingUser = await User.findOne({
          email: user.email,
          provider: account.provider,
        });

        if (!existingUser) {
          const newUser = new User({
            email: user.email,
            photoUrl: user.image ?? "",
            name: user.name ?? "",
            provider: account.provider,
            providerAccountId: account.providerAccountId,
            refreshToken: account.refresh_token ?? "",
          });
          await newUser.save();
        } else {
          existingUser.refreshToken = account.refresh_token ?? existingUser.refreshToken;
          existingUser.photoUrl = user.image ?? existingUser.photoUrl;
          await existingUser.save();
        }
      } catch (error) {
        console.error("Error saving user during signIn:", error);
      }
    },
  },
};
