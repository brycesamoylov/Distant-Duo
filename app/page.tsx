"use client";

import { Card } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { usePartner } from "@/hooks/use-partner";
import { Calendar, MessageCircle, Smile, Film, Heart, Users, Clock, Gamepad2 } from "lucide-react";
import Link from "next/link";
import { RandomEmoticon } from '@/components/ui/emoticon';

export default function HomePage() {
  const { data: session } = useSession();
  const { partner } = usePartner();

  if (!session) {
    return (
      <div className="space-y-12">
        <section className="text-center py-16 bg-gradient-to-r from-pink-50 to-purple-50 rounded-3xl">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Welcome to DistantDuo</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Stay connected with your loved one across any distance. Share moments, plan dates, and keep your bond strong.
          </p>
          <div className="text-4xl animate-bounce">{<RandomEmoticon />}</div>
        </section>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-8 hover:shadow-lg transition-all">
            <Heart className="h-12 w-12 text-pink-600 mb-6" />
            <h2 className="text-2xl font-semibold mb-3">Share Your Journey</h2>
            <p className="text-gray-500">Connect, communicate, and create lasting memories together, no matter the distance.</p>
          </Card>

          <Card className="p-8 hover:shadow-lg transition-all">
            <Calendar className="h-12 w-12 text-pink-600 mb-6" />
            <h2 className="text-2xl font-semibold mb-3">Plan Together</h2>
            <p className="text-gray-500">Keep track of important dates, plan virtual dates, and countdown to your next meeting.</p>
          </Card>

          <Card className="p-8 hover:shadow-lg transition-all">
            <Gamepad2 className="h-12 w-12 text-pink-600 mb-6" />
            <h2 className="text-2xl font-semibold mb-3">Have Fun</h2>
            <p className="text-gray-500">Play games together, share emotions, and keep the spark alive with interactive activities.</p>
          </Card>
        </div>

        <section className="text-center py-8">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">Start Your Journey Today</h2>
          <p className="text-gray-500 mb-6">Sign in to connect with your partner and explore all features.</p>
        </section>
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="text-center py-16 space-y-8">
        <div className="text-4xl mb-8">{<RandomEmoticon />}</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Almost There!</h1>
        <p className="text-xl text-gray-500 mb-8 max-w-xl mx-auto">
          Link with your partner to start your journey together and unlock all features.
        </p>
        <Link 
          href="/profile"
          className="inline-block bg-pink-600 text-white px-8 py-4 rounded-lg hover:bg-pink-700 transition-colors text-lg font-medium"
        >
          Go to Profile
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <section className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-3xl p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="text-3xl">{<RandomEmoticon />}</div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Welcome Back!</h1>
            <p className="text-xl text-gray-600">Stay connected with {partner.name}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 bg-white/50">
            <Users className="h-5 w-5 text-pink-600 mb-2" />
            <p className="text-sm text-gray-600">Connected with</p>
            <p className="font-medium">{partner.name}</p>
          </Card>
          
          <Card className="p-4 bg-white/50">
            <Clock className="h-5 w-5 text-pink-600 mb-2" />
            <p className="text-sm text-gray-600">Local Time</p>
            <p className="font-medium">{new Date().toLocaleTimeString()}</p>
          </Card>
          
          <Card className="p-4 bg-white/50">
            <Heart className="h-5 w-5 text-pink-600 mb-2" />
            <p className="text-sm text-gray-600">Status</p>
            <p className="font-medium">Connected</p>
          </Card>
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-6">
        <Link href="/chat">
          <Card className="p-8 hover:shadow-lg transition-all cursor-pointer group">
            <MessageCircle className="h-12 w-12 text-pink-600 mb-6 group-hover:scale-110 transition-transform" />
            <h2 className="text-2xl font-semibold mb-3">Chat</h2>
            <p className="text-gray-500">Send messages and stay in touch throughout the day.</p>
          </Card>
        </Link>

        <Link href="/calendar">
          <Card className="p-8 hover:shadow-lg transition-all cursor-pointer group">
            <Calendar className="h-12 w-12 text-pink-600 mb-6 group-hover:scale-110 transition-transform" />
            <h2 className="text-2xl font-semibold mb-3">Calendar</h2>
            <p className="text-gray-500">View and plan your special dates and upcoming events.</p>
          </Card>
        </Link>

        <Link href="/emotions">
          <Card className="p-8 hover:shadow-lg transition-all cursor-pointer group">
            <Smile className="h-12 w-12 text-pink-600 mb-6 group-hover:scale-110 transition-transform" />
            <h2 className="text-2xl font-semibold mb-3">Feelings</h2>
            <p className="text-gray-500">Share your emotions and stay connected emotionally.</p>
          </Card>
        </Link>

        <Link href="/activities">
          <Card className="p-8 hover:shadow-lg transition-all cursor-pointer group">
            <Film className="h-12 w-12 text-pink-600 mb-6 group-hover:scale-110 transition-transform" />
            <h2 className="text-2xl font-semibold mb-3">Activities</h2>
            <p className="text-gray-500">Play games and enjoy activities together.</p>
          </Card>
        </Link>
      </div>
    </div>
  );
}