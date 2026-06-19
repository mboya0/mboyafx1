import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ensureCurrentUser, apiError } from '@/lib/api';

export async function POST(request: Request) {
  try {
    const user = await ensureCurrentUser(request);
    const body = await request.json();
    const traderId = body.traderId;
    const allocation = Number(body.allocation) || 1.0;
    if (typeof traderId !== 'string' || !traderId) {
      return apiError(400, 'Missing traderId');
    }
    const trader = await prisma.appUser.findUnique({ where: { id: traderId } });
    if (!trader) {
      return apiError(404, 'Trader not found');
    }

    const subscription = await prisma.copySubscription.upsert({
      where: { traderId_followerId: { traderId, followerId: user.id } },
      create: { traderId, followerId: user.id, allocation, isActive: true },
      update: { allocation, isActive: true },
    });

    return NextResponse.json({ subscription });
  } catch (error) {
    if (error instanceof NextResponse) return error;
    return apiError(500, 'Failed to create subscription');
  }
}

export async function GET(request: Request) {
  try {
    const user = await ensureCurrentUser(request);
    const subscriptions = await prisma.copySubscription.findMany({
      where: { followerId: user.id },
      include: { trader: { select: { id: true, displayName: true, avatarUrl: true } } },
    });
    return NextResponse.json({ subscriptions });
  } catch (error) {
    if (error instanceof NextResponse) return error;
    return apiError(500, 'Failed to load subscriptions');
  }
}
