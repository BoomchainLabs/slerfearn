import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Real user stats for development - replace with actual database queries
    const userStats = {
      lerfBalance: 2500000, // 2.5M $LERF
      totalEarned: 5000000, // 5M $LERF total earned
      dailyMissionsCompleted: 12,
      triviaCorrect: 45,
      triviaTotal: 60,
      walletsConnected: 2,
      socialConnections: 3
    };
    
    return NextResponse.json(userStats);
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return NextResponse.json(
      { message: "Failed to fetch user stats" },
      { status: 500 }
    );
  }
}