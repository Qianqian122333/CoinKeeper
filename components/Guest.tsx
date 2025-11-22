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
            A simple expense tracker that makes financial management easy and
            enjoyable
          </p>
          <div className="pt-4">
            <SignInButton mode="modal">
              <Button size="lg" className="text-lg px-8 py-6">
                Login Now to Start Tracking
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
                <CardTitle>Data Visualization</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                Intuitive pie charts display your expense distribution, giving
                you a clear view of where your money goes and helping you plan
                your finances better
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <CardTitle>Category Management</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                Multiple expense categories to choose from, including Food &
                Drinks, Transportation, Housing, Entertainment, and more for
                easy categorization
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-lg">
                  <Sparkles className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <CardTitle>Clean Interface</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                Fresh and clean design with no unnecessary features, focused on
                expense tracking itself for a smoother user experience
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                  <Lock className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <CardTitle>Secure & Reliable</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                Using Clerk authentication system to ensure your financial data
                is safe and private, accessible only by you
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
                <CardTitle className="text-2xl">More Features</CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Continuously improving to bring you a better expense tracking
                  experience
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
                <span>
                  Quickly record every expense, manage finances anytime,
                  anywhere
                </span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 bg-amber-500 rounded-full"></div>
                <span>
                  Filter and view history by category for easy searching
                </span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                <span>
                  Pagination support for smooth browsing of large amounts of
                  data
                </span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 bg-orange-600 rounded-full"></div>
                <span>Dark mode support to protect your eyes</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center space-y-4 pt-4">
          <p className="text-gray-600 dark:text-gray-400">
            Start using CoinKeeper now and make expense tracking simpler
          </p>
          <SignInButton mode="modal">
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              Login / Sign Up
            </Button>
          </SignInButton>
        </div>
      </div>
    </div>
  );
};

export default Guest;
