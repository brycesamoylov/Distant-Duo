"use client";

import { Button } from "@/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";

export function LoginButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <Button 
        variant="outline" 
        onClick={() => signOut()}
        className="text-gray-600 hover:text-pink-600"
      >
        Sign Out
      </Button>
    );
  }

  return (
    <Button 
      onClick={() => signIn("google")}
      className="bg-pink-600 hover:bg-pink-700"
    >
      Sign In with Google
    </Button>
  );
} 