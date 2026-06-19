import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ensureCurrentUser, apiError } from '@/lib/api';

export async function GET(request: Request) {
  try {
    const user = await ensureCurrentUser(request);
    const followers = await prisma.follower.findMany({
      where: { traderId: user.id },
      include: {
        follower: {
          select: { id: true, displayName: true, avatarUrl: true },
        },
      },
    });
    return NextResponse.json({ followers });
  } catch (error) {
    if (error instanceof NextResponse) return error;
    return apiError(500, 'Failed to load followers');
  }
}

export async function POST(request: Request) {
  try {
    const user = await ensureCurrentUser(request);
    const body = await request.json();
    const traderId = body.traderId;
    if (typeof traderId !== 'string' || !traderId) {
      return apiError(400, 'Missing traderId');
    }

    const trader = await prisma.appUser.findUnique({ where: { id: traderId } });
    if (!trader) {
      return apiError(404, 'Trader not found');
    }

    const subscription = await prisma.follower.upsert({
      where: { traderId_followerId: { traderId, followerId: user.id } },
      create: { traderId, followerId: user.id },
      update: {},
    });

    await prisma.traderProfile.update({
      where: { userId: traderId },
      data: { followersCount: { increment: 1 } },
    });

    return NextResponse.json({ follower: subscription });
  } catch (error) {
    if (error instanceof NextResponse) return error;
    return apiError(500, 'Failed to follow trader');
  }
}
