import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import Image from "next/image";

const Welcome = async () => {
  const user = await currentUser();

  if (!user) return null;

  // 获取当前时间并根据时段返回问候语
  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      return "早上好";
    } else if (hour >= 12 && hour < 18) {
      return "下午好";
    } else if (hour >= 18 && hour < 22) {
      return "晚上好";
    } else {
      return "夜深了";
    }
  };

  const greeting = getGreeting();
  const userName = user.firstName || user.username || "用户";
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

          {/* 问候文字 */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold">
              {greeting}，{userName}！
            </h2>
            <p className="text-muted-foreground mt-1">
              欢迎回来，开始管理您的财务吧 ✨
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Welcome;
