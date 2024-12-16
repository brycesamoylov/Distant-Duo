"use client";

import { Heart, Home, MessageCircle, Film, Smile, User, Calendar } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LoginButton } from "@/components/auth/login-button";
import { useSession } from "next-auth/react";

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: MessageCircle, label: "Chat", href: "/chat" },
  { icon: Calendar, label: "Calendar", href: "/calendar" },
  { icon: Smile, label: "Feelings", href: "/emotions" },
  { icon: Film, label: "Activities", href: "/activities" },
  { icon: User, label: "Profile", href: "/profile" },
];

export function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 border-b bg-white/50 backdrop-blur-sm">
      <div className="flex h-16 items-center px-4 max-w-6xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-pink-600">
          <Heart className="h-6 w-6 fill-current" />
          <span className="text-xl font-semibold">DistantDuo</span>
        </Link>
        
        <nav className="ml-auto flex items-center gap-6">
          {session && navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-1 text-sm transition-colors",
                pathname === item.href
                  ? "text-pink-600"
                  : "text-gray-600 hover:text-pink-600"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
          <LoginButton />
        </nav>
      </div>
    </header>
  );
}