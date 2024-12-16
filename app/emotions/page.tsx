"use client";

import { Card } from "@/components/ui/card";
import { 
  Heart, 
  ThumbsUp, 
  Star, 
  Coffee, 
  Music, 
  Frown, 
  Smile, 
  HeartCrack,
  Laugh,
  Moon
} from "lucide-react";
import { useEmotions } from "@/hooks/use-emotions";
import { useSession } from "next-auth/react";
import { usePartner } from "@/hooks/use-partner";
import { format } from "date-fns";

const emotions = [
  { icon: Heart, label: "In Love", color: "text-pink-600" },
  { icon: Smile, label: "Happy", color: "text-yellow-500" },
  { icon: Coffee, label: "Missing You", color: "text-blue-500" },
  { icon: HeartCrack, label: "Lonely", color: "text-purple-500" },
  { icon: Star, label: "Excited", color: "text-amber-500" },
  { icon: Frown, label: "Sad", color: "text-gray-500" },
  { icon: Music, label: "Romantic", color: "text-red-500" },
  { icon: Moon, label: "Dreamy", color: "text-indigo-500" },
  { icon: Laugh, label: "Joyful", color: "text-green-500" },
  { icon: ThumbsUp, label: "Supportive", color: "text-teal-500" },
];

export default function EmotionsPage() {
  const { data: session } = useSession();
  const { partner } = usePartner();
  const { emotions: currentEmotions, loading, setEmotion } = useEmotions();

  if (!session) {
    return (
      <div className="text-center text-gray-500 mt-8">
        Please sign in to share emotions
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="text-center text-gray-500 mt-8">
        Link with your partner to share emotions
      </div>
    );
  }

  const userEmotion = currentEmotions.find(e => e.userId === session.user.id);
  const partnerEmotion = currentEmotions.find(e => e.userId === partner.id);

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-gray-900">Share Your Feelings</h1>
        <p className="text-gray-500 mt-2">Let your partner know how you're feeling right now</p>
      </section>

      {(userEmotion || partnerEmotion) && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Current Feelings</h2>
          <div className="grid gap-4">
            {userEmotion && (
              <Card className="p-4">
                <p className="text-lg text-gray-900">
                  You are feeling <span className="font-medium">{userEmotion.type}</span>
                  <span className="text-sm text-gray-500 ml-2">
                    {format(userEmotion.createdAt, 'p')}
                  </span>
                </p>
              </Card>
            )}
            {partnerEmotion && (
              <Card className="p-4">
                <p className="text-lg text-gray-900">
                  {partner.name} is feeling <span className="font-medium">{partnerEmotion.type}</span>
                  <span className="text-sm text-gray-500 ml-2">
                    {format(partnerEmotion.createdAt, 'p')}
                  </span>
                </p>
              </Card>
            )}
          </div>
        </section>
      )}
      
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">Choose Your Emotion</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {emotions.map(({ icon: Icon, label, color }) => (
            <Card 
              key={label} 
              className="p-6 text-center hover:scale-105 cursor-pointer transition-all duration-200 hover:shadow-lg"
              onClick={() => setEmotion(label)}
            >
              <Icon className={`h-10 w-10 mx-auto mb-3 ${color}`} />
              <h3 className="font-medium text-gray-900">{label}</h3>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}