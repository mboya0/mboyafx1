import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ensureCurrentUser, apiError } from '@/lib/api';

export async function GET(request: Request) {
  try {
    const user = await ensureCurrentUser(request);
    const bots = await prisma.bot.findMany({
      where: { ownerId: user.id },
      take: 20,
    });
    return NextResponse.json({ bots });
  } catch (error) {
    if (error instanceof NextResponse) return error;
    return apiError(500, 'Failed to load bots');
  }
}

export async function POST(request: Request) {
  try {
    const user = await ensureCurrentUser(request);
    const body = await request.json();
    const { name, description, config, riskSettings } = body;

    if (typeof name !== 'string' || !name) {
      return apiError(400, 'Bot name is required');
    }

    const bot = await prisma.bot.create({
      data: {
        ownerId: user.id,
        name,
        description: typeof description === 'string' ? description : '',
        config: config ?? {},
        riskSettings: riskSettings ?? {},
        performanceStats: {},
      },
    });

    return NextResponse.json({ bot });
  } catch (error) {
    if (error instanceof NextResponse) return error;
    return apiError(500, 'Failed to create bot');
  }
}
