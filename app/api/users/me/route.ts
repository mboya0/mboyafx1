import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ensureCurrentUser, apiError } from '@/lib/api';

export async function GET(request: Request) {
  try {
    const user = await ensureCurrentUser(request);
    return NextResponse.json({ user });
  } catch (error) {
    if (error instanceof NextResponse) return error;
    return apiError(500, 'Failed to load user');
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await ensureCurrentUser(request);
    const body = await request.json();
    const updates: Record<string, any> = {};
    if (typeof body.displayName === 'string') updates.displayName = body.displayName;
    if (typeof body.avatarUrl === 'string') updates.avatarUrl = body.avatarUrl;
    if (typeof body.bio === 'string') updates.bio = body.bio;

    if (Object.keys(updates).length === 0) {
      return apiError(400, 'No valid fields provided');
    }

    const updated = await prisma.appUser.update({
      where: { id: user.id },
      data: updates,
    });

    return NextResponse.json({ user: updated });
  } catch (error) {
    if (error instanceof NextResponse) return error;
    return apiError(500, 'Failed to update user');
  }
}
