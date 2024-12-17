"use client";

import { Heart, Home, MessageCircle, Film, Smile, User, Calendar, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LoginButton } from "@/components/auth/login-button";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

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
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-white/50 backdrop-blur-sm">
      <div className="flex h-16 items-center px-4 max-w-6xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-pink-600">
          <Heart className="h-6 w-6 fill-current" />
          <span className="text-xl font-semibold">DistantDuo</span>
        </Link>
        
        <nav className="ml-auto hidden md:flex items-center gap-6">
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

        <div className="ml-auto md:hidden flex items-center gap-4">
          <LoginButton />
          {session && (
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[80vw] sm:w-[385px]">
                <nav className="flex flex-col gap-4 mt-8">
                  {navItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg transition-colors",
                        pathname === item.href
                          ? "bg-pink-50 text-pink-600"
                          : "text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
}