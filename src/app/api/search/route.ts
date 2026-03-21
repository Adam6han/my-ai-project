import { NextResponse } from "next/server";
import { getDefaultUser } from "@/lib/default-user";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const user = await getDefaultUser();
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim() || "";

    if (!q) {
      return NextResponse.json([]);
    }

    const notes = await prisma.note.findMany({
      where: {
        userId: user.id,
        OR: [
          { title: { contains: q } },
          { content: { contains: q } },
          {
            tags: {
              some: {
                tag: {
                  name: { contains: q },
                },
              },
            },
          },
        ],
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 100,
    });

    return NextResponse.json(notes);
  } catch {
    return NextResponse.json({ error: "检索失败" }, { status: 500 });
  }
}
