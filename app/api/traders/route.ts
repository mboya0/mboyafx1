import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiError } from '@/lib/api';

export async function GET() {
  try {
    const traders = await prisma.traderProfile.findMany({
      include: {
        user: {
          select: { id: true, displayName: true, avatarUrl: true, bio: true },
        },
      },
      orderBy: [{ roi: 'desc' }, { winRate: 'desc' }],
      take: 20,
    });

    return NextResponse.json({ traders });
  } catch (error) {
    return apiError(500, 'Failed to list traders');
  }
}
