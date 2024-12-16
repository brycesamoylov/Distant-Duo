"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export function PartnerLinkForm() {
  const [partnerEmail, setPartnerEmail] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const res = await fetch("/api/partner/link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ partnerEmail }),
      });

      if (!res.ok) throw new Error();

      toast({
        title: "Success",
        description: "Partner linked successfully!",
      });
      
      setPartnerEmail("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to link partner. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Link with Partner</h3>
        <p className="text-sm text-gray-500">
          Enter your partner's email to connect your accounts
        </p>
      </div>
      <div className="flex gap-2">
        <Input
          type="email"
          placeholder="partner@example.com"
          value={partnerEmail}
          onChange={(e) => setPartnerEmail(e.target.value)}
          required
        />
        <Button type="submit" className="bg-pink-600 hover:bg-pink-700">
          Link Partner
        </Button>
      </div>
    </form>
  );
} 