"use client";

import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Clock } from "lucide-react";
import { useSession } from "next-auth/react";
import { PartnerLinkForm } from "@/components/profile/partner-link-form";
import { EditProfileDialog } from "@/components/profile/edit-profile-dialog";
import { PartnerInfo } from "@/components/profile/partner-info";
import { usePartner } from "@/hooks/use-partner";
import { LucideIcon } from "@/components/ui/lucide-icon";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { getRandomEmoticon } from "@/lib/emoticons";

export default function ProfilePage() {
  const { data: session } = useSession();
  const { partner } = usePartner();

  if (!session?.user) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <h1 className="text-2xl text-gray-500">Please sign in to view your profile</h1>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
      
      <Card className="p-6">
        <div className="flex items-start space-x-6">
          <Avatar className="w-24 h-24">
            <div className="w-24 h-24 rounded-full bg-pink-100 flex items-center justify-center text-2xl">
              {getRandomEmoticon()}
            </div>
          </Avatar>
          
          <div className="flex-1">
            <h2 className="text-2xl font-semibold text-gray-900">
              {session.user.name || "Anonymous User"}
            </h2>
            <p className="text-gray-500 mt-1">{session.user.email}</p>
            
            <div className="mt-4 space-y-2">
              <div className="flex items-center text-gray-500">
                <Clock className="h-4 w-4 mr-2" />
                Member since {new Date().toLocaleDateString()}
              </div>
            </div>
            
            <div className="mt-6 space-y-6">
              <EditProfileDialog />

              {!partner && (
                <div className="border-t pt-6">
                  <PartnerLinkForm />
                </div>
              )}

              {partner && <PartnerInfo />}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}