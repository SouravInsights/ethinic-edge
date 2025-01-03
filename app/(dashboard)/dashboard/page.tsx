"use client";

import Link from "next/link";
import { Plus, Clock, Book } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardContext } from "@/app/(dashboard)/context/DashboardContext";
import { MOTIVATIONAL_QUOTES } from "@/lib/constants";
import { useUser } from "@clerk/nextjs";

function LoadingState() {
  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-16" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { stats, isLoading } = useDashboardContext();
  const { user } = useUser();
  const randomQuote =
    MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];

  if (isLoading || !stats) return <LoadingState />;

  // Get user's first name or full name
  const userName = user?.firstName || user?.fullName || "there";

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 to-white px-4 py-6">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Hi {userName}! 👋
          </h1>
          <p className="text-gray-600 mt-1">{randomQuote}</p>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4">
          <Link href="/dashboard/meetings/new">
            <Button className="w-full h-auto p-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <Plus className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">New Meeting</div>
                  <div className="text-sm opacity-90">
                    Record vendor details & designs
                  </div>
                </div>
              </div>
            </Button>
          </Link>

          <Link href="/dashboard/meetings">
            <Card className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3">
                <div className="bg-pink-100 p-2 rounded-full">
                  <Clock className="h-6 w-6 text-pink-500" />
                </div>
                <div>
                  <h2 className="font-semibold">Recent Meetings</h2>
                  <p className="text-sm text-gray-500">
                    View your latest meetings
                  </p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/dashboard/designs">
            <Card className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-100 p-2 rounded-full">
                  <Book className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <h2 className="font-semibold">Design Library</h2>
                  <p className="text-sm text-gray-500">
                    Browse your design collection
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="text-sm text-gray-500">Total Meetings</div>
            <div className="text-2xl font-bold text-gray-800 mt-1">
              {stats.totalMeetings}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-500">Saved Designs</div>
            <div className="text-2xl font-bold text-gray-800 mt-1">
              {stats.totalDesigns}
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
