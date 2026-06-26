import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const user = await getAuthenticatedUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const stories = await prisma.story.findMany({
      where: { authorId: user.id },
      select: {
        id: true,
        title: true,
        body: true,
        tags: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const posts = stories.map((s) => {
      let parsedTags: string[] = [];
      try {
        parsedTags = JSON.parse(s.tags || "[]");
      } catch {}
      return {
        id: s.id,
        title: s.title,
        content: s.body,
        tags: parsedTags,
        status: s.status,
        createdAt: s.createdAt,
      };
    });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("API /api/me/posts error:", error);
    return NextResponse.json({ posts: [] }, { status: 500 });
  }
}
