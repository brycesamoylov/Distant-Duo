"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  Heart,
  Star,
  Music,
  Smile,
  Sun,
  Moon,
  Cloud,
  Coffee,
  Sparkles,
  Flower2,
  Cat,
  Dog,
  Bird,
  Cake,
  Camera,
  Palette,
} from "lucide-react";

const AVATARS = [
  { icon: Heart, name: "Heart", color: "text-pink-500", bg: "bg-pink-100" },
  { icon: Star, name: "Star", color: "text-yellow-500", bg: "bg-yellow-100" },
  { icon: Music, name: "Music", color: "text-purple-500", bg: "bg-purple-100" },
  { icon: Smile, name: "Smile", color: "text-green-500", bg: "bg-green-100" },
  { icon: Sun, name: "Sun", color: "text-orange-500", bg: "bg-orange-100" },
  { icon: Moon, name: "Moon", color: "text-indigo-500", bg: "bg-indigo-100" },
  { icon: Cloud, name: "Cloud", color: "text-blue-500", bg: "bg-blue-100" },
  { icon: Coffee, name: "Coffee", color: "text-amber-500", bg: "bg-amber-100" },
  { icon: Sparkles, name: "Sparkles", color: "text-teal-500", bg: "bg-teal-100" },
  { icon: Flower2, name: "Flower2", color: "text-rose-500", bg: "bg-rose-100" },
  { icon: Cat, name: "Cat", color: "text-gray-500", bg: "bg-gray-100" },
  { icon: Dog, name: "Dog", color: "text-brown-500", bg: "bg-amber-200" },
  { icon: Bird, name: "Bird", color: "text-sky-500", bg: "bg-sky-100" },
  { icon: Cake, name: "Cake", color: "text-pink-400", bg: "bg-pink-50" },
  { icon: Camera, name: "Camera", color: "text-slate-500", bg: "bg-slate-100" },
  { icon: Palette, name: "Palette", color: "text-emerald-500", bg: "bg-emerald-100" },
];

const COLORS = [
  { name: "Pink", value: "bg-pink-500" },
  { name: "Rose", value: "bg-rose-500" },
  { name: "Fuchsia", value: "bg-fuchsia-500" },
  { name: "Purple", value: "bg-purple-500" },
  { name: "Violet", value: "bg-violet-500" },
  { name: "Indigo", value: "bg-indigo-500" },
  { name: "Blue", value: "bg-blue-500" },
  { name: "Sky", value: "bg-sky-500" },
  { name: "Cyan", value: "bg-cyan-500" },
  { name: "Teal", value: "bg-teal-500" },
  { name: "Emerald", value: "bg-emerald-500" },
  { name: "Green", value: "bg-green-500" },
  { name: "Lime", value: "bg-lime-500" },
  { name: "Yellow", value: "bg-yellow-500" },
  { name: "Amber", value: "bg-amber-500" },
  { name: "Orange", value: "bg-orange-500" },
  { name: "Red", value: "bg-red-500" },
  { name: "Slate", value: "bg-slate-500" },
  { name: "Gray", value: "bg-gray-500" },
  { name: "Zinc", value: "bg-zinc-500" },
];

interface AvatarPickerProps {
  onSelect: (avatar: { icon: any; name: string; color: string; bg: string }) => void;
  selectedIcon?: any;
  selectedColor?: string;
  selectedBg?: string;
}

export function AvatarPicker({ onSelect, selectedIcon, selectedColor, selectedBg }: AvatarPickerProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          Customize Avatar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Choose Your Avatar</DialogTitle>
          <DialogDescription>
            Select an icon and color to personalize your profile.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="icons">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="icons">Icons</TabsTrigger>
            <TabsTrigger value="colors">Colors</TabsTrigger>
          </TabsList>
          <TabsContent value="icons" className="mt-4">
            <div className="grid grid-cols-5 gap-2">
              {AVATARS.map(({ icon: Icon, name, color, bg }, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className={cn(
                    "h-12 w-12 p-0",
                    selectedIcon === Icon && selectedColor === color && "ring-2 ring-pink-500"
                  )}
                  onClick={() => onSelect({ icon: Icon, name, color, bg })}
                >
                  <Icon className={cn("h-6 w-6", color)} />
                </Button>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="colors" className="mt-4">
            <div className="grid grid-cols-5 gap-2">
              {COLORS.map(({ value }, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className={cn(
                    "h-12 w-12 p-0",
                    value,
                    selectedBg === value && "ring-2 ring-pink-500"
                  )}
                  onClick={() => onSelect({
                    icon: selectedIcon || Heart,
                    name: "Heart",
                    color: value.replace('bg-', 'text-'),
                    bg: value.replace('-500', '-100')
                  })}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
} 