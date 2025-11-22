import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import Image from "next/image";

const Welcome = async () => {
  const user = await currentUser();

  if (!user) return null;

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      return "Good morning";
    } else if (hour >= 12 && hour < 18) {
      return "Good afternoon";
    } else if (hour >= 18 && hour < 22) {
      return "Good evening";
    } else {
      return "Good night";
    }
  };

  const greeting = getGreeting();
  const userName = user.firstName || user.username || "User";
  const avatarUrl = user.imageUrl;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-4">
          {/* 圆形头像 */}
          <div className="relative">
            <div className="h-16 w-16 rounded-full overflow-hidden shadow-md">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={userName}
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-linear-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white text-2xl font-bold">
                  {userName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
          </div>

          {/* Greeting Text */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold">
              {greeting}, {userName}!
            </h2>
            <p className="text-muted-foreground mt-1">
              Welcome back, start managing your finances ✨
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Welcome;
