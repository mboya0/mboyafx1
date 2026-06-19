import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export function getDerivLoginId(request: Request): string | null {
  const value = request.headers.get('x-deriv-login-id')?.trim();
  return value && value.length > 0 ? value : null;
}

export async function getCurrentUser(request: Request) {
  const derivLoginId = getDerivLoginId(request);
  if (!derivLoginId) return null;
  return prisma.appUser.findUnique({
    where: { derivLoginId },
    include: { traderProfile: true },
  });
}

export async function ensureCurrentUser(request: Request) {
  const derivLoginId = getDerivLoginId(request);
  if (!derivLoginId) {
    throw new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  return prisma.appUser.upsert({
    where: { derivLoginId },
    update: {},
    create: {
      derivLoginId,
      displayName: `Trader ${derivLoginId.slice(-6)}`,
      traderProfile: {
        create: {
          riskScore: 50,
          winRate: 0,
          roi: 0,
          followersCount: 0,
        },
      },
    },
    include: { traderProfile: true },
  });
}

export async function ensureTraderProfile(userId: string) {
  const profile = await prisma.traderProfile.findUnique({ where: { userId } });
  if (profile) return profile;

  return prisma.traderProfile.create({
    data: {
      userId,
      riskScore: 50,
      winRate: 0,
      roi: 0,
      followersCount: 0,
    },
  });
}

export function apiError(status: number, message: string) {
  return NextResponse.json({ error: message }, { status });
}
