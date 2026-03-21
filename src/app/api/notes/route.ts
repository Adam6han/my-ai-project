import { NextResponse } from "next/server";
import { getDefaultUser } from "@/lib/default-user";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getDefaultUser();
    const notes = await prisma.note.findMany({
      where: {
        userId: user.id,
        status: "已处理",
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
      take: 200,
    });

    return NextResponse.json(notes);
  } catch {
    return NextResponse.json({ error: "获取笔记列表失败" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getDefaultUser();
    const body = (await request.json()) as {
      title?: string;
      content?: string;
      noteType?: string;
    };
    const title = body.title?.trim();
    const content = body.content?.trim();

    if (!title || !content) {
      return NextResponse.json(
        { error: "标题和内容不能为空" },
        { status: 400 },
      );
    }

    const note = await prisma.note.create({
      data: {
        userId: user.id,
        title,
        content,
        status: "已处理",
        noteType: body.noteType?.trim() || "原子笔记",
      },
    });

    return NextResponse.json(note, { status: 201 });
  } catch {
    return NextResponse.json({ error: "创建笔记失败" }, { status: 500 });
  }
}
