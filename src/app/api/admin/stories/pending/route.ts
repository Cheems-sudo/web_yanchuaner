import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requireAdmin } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth) return auth;

  try {
    const stories = await prisma.story.findMany({
      where: { status: 'PENDING' },
      include: {
        authorUser: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
            graduationClass: true,
            className: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const data = stories.map((s) => {
      let parsedTags = [];
      try {
        parsedTags = JSON.parse(s.tags || '[]');
      } catch {}
      return {
        ...s,
        tags: parsedTags,
      };
    });

    return NextResponse.json({ stories: data });
  } catch (error) {
    console.error('Admin pending stories GET error:', error);
    return NextResponse.json({ error: '加载失败' }, { status: 500 });
  }
}
