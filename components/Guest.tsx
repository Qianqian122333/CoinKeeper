import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/nextjs";
import {
  Wallet,
  PieChart,
  BarChart3,
  Sparkles,
  Lock,
  TrendingUp,
} from "lucide-react";

const Guest = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-4">
            <div className="bg-[linear-gradient(145deg,#FFD700_0%,#FFC107_10%,#FF8C00_35%,#CC5500_70%,#FFC107_85%,#FFD700_100%)] p-4 rounded-2xl shadow-lg">
              <Wallet className="h-16 w-16 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-[linear-gradient(90deg,#FF8C00,#CC5500,#FF8C00)] bg-clip-text text-transparent">
            CoinKeeper
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            一款简洁的记账软件，让财务管理变得轻松愉快
          </p>
          <div className="pt-4">
            <SignInButton mode="modal">
              <Button size="lg" className="text-lg px-8 py-6">
                立即登录，开始记账
              </Button>
            </SignInButton>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 pt-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                  <PieChart className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <CardTitle>数据可视化</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                直观的饼图展示您的支出分布，一目了然地了解资金流向，帮助您更好地规划财务
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <CardTitle>分类管理</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                多种支出类别供您选择，包括食品饮料、交通出行、住房租金、娱乐休闲等，轻松分类记录
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-lg">
                  <Sparkles className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <CardTitle>简洁界面</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                清爽简洁的设计风格，无多余功能干扰，专注于记账本身，让您的使用体验更加流畅
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                  <Lock className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <CardTitle>安全可靠</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                采用 Clerk
                身份认证系统，确保您的财务数据安全私密，只有您自己能够访问
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Additional Features */}
        <Card className="bg-[linear-gradient(135deg,#FFF8DC,#FFE4B5)] dark:bg-[linear-gradient(135deg,#4A3000,#664400)] border-2 border-orange-200 dark:border-orange-800">
          <CardHeader>
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              <div>
                <CardTitle className="text-2xl">更多功能</CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  持续优化中，为您带来更好的记账体验
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
                <span>快速记录每一笔支出，随时随地管理财务</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 bg-amber-500 rounded-full"></div>
                <span>按类别筛选和查看历史记录，方便查找</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                <span>分页显示，流畅浏览大量记账数据</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 bg-orange-600 rounded-full"></div>
                <span>支持深色模式，保护您的眼睛</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center space-y-4 pt-4">
          <p className="text-gray-600 dark:text-gray-400">
            现在就开始使用 CoinKeeper，让记账变得更简单
          </p>
          <SignInButton mode="modal">
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              登录 / 注册
            </Button>
          </SignInButton>
        </div>
      </div>
    </div>
  );
};

export default Guest;
