import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      avatar?: {
        icon: string;
        color: string;
        bg: string;
      };
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    avatar?: {
      icon: string;
      color: string;
      bg: string;
    };
    partnerId?: string | null;
  }
} 