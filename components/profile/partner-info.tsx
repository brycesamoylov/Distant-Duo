"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { usePartner } from "@/hooks/use-partner";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { doc, updateDoc, deleteDoc, query, collection, where, getDocs } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { getRandomEmoticon } from "@/lib/emoticons";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function PartnerInfo() {
  const router = useRouter();
  const { partner, loading } = usePartner();
  const { data: session } = useSession();
  const { toast } = useToast();
  const [unlinkDialogOpen, setUnlinkDialogOpen] = useState(false);

  if (loading) {
    return <div>Loading partner information...</div>;
  }

  if (!partner) {
    return null;
  }

  const handleUnlink = async () => {
    if (!session?.user?.id || !partner.id) return;

    try {
      // Update both users to remove partner links
      await Promise.all([
        updateDoc(doc(db, 'users', session.user.id), { partnerId: null }),
        updateDoc(doc(db, 'users', partner.id), { partnerId: null })
      ]);

      // Clean up shared data
      const cleanupQueries = [
        query(collection(db, 'messages'), where('userId', 'in', [session.user.id, partner.id])),
        query(collection(db, 'emotions'), where('userId', 'in', [session.user.id, partner.id])),
        query(collection(db, 'hangman_games'), where('players', 'array-contains', session.user.id)),
        query(collection(db, 'wordle_games'), where('players', 'array-contains', session.user.id))
      ];

      for (const q of cleanupQueries) {
        const snapshot = await getDocs(q);
        await Promise.all(snapshot.docs.map(doc => deleteDoc(doc.ref)));
      }

      toast({
        title: "Success",
        description: "Partner unlinked successfully",
      });

      // Close dialog and redirect to home
      setUnlinkDialogOpen(false);
      router.push('/');
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to unlink partner",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Partner</h2>
      <div className="flex items-start space-x-4">
        <Avatar className="w-16 h-16">
          <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center text-xl">
            {getRandomEmoticon()}
          </div>
        </Avatar>
        
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900">
            {partner.name || "Anonymous Partner"}
          </h3>
          <p className="text-gray-500">{partner.email}</p>
          
          <Dialog open={unlinkDialogOpen} onOpenChange={setUnlinkDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="mt-4 text-red-600 hover:text-red-700"
              >
                Unlink Partner
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Unlink</DialogTitle>
                <DialogDescription>
                  Are you sure you want to unlink with {partner.name}? This will:
                  <ul className="list-disc list-inside mt-2">
                    <li>Remove your partner connection</li>
                    <li>Delete all shared messages</li>
                    <li>Delete all shared emotions</li>
                    <li>Delete all game progress</li>
                  </ul>
                  This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setUnlinkDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleUnlink}
                >
                  Unlink Partner
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </Card>
  );
} 