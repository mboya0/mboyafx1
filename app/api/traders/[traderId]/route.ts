import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiError } from '@/lib/api';

interface Params {
  params: {
    traderId: string;
  };
}

export async function GET(request: Request, { params }: Params) {
  try {
    const trader = await prisma.traderProfile.findUnique({
      where: { userId: params.traderId },
      include: {
        user: {
          select: { id: true, displayName: true, avatarUrl: true, bio: true },
        },
        copySubscriptions: true,
      },
    });

    if (!trader) {
      return apiError(404, 'Trader not found');
    }

    return NextResponse.json({ trader });
  } catch (error) {
    return apiError(500, 'Failed to load trader');
  }
}
