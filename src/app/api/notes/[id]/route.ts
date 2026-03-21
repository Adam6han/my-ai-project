import { NextResponse } from "next/server";
import { getDefaultUser } from "@/lib/default-user";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const user = await getDefaultUser();
    const note = await prisma.note.findFirst({
      where: {
        id,
        userId: user.id,
      },
      include: {
        tags: {
          include: { tag: true },
        },
        incomingLinks: true,
        outgoingLinks: true,
      },
    });

    if (!note) {
      return NextResponse.json({ error: "笔记不存在" }, { status: 404 });
    }

    return NextResponse.json(note);
  } catch {
    return NextResponse.json({ error: "获取笔记详情失败" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const user = await getDefaultUser();
    const body = (await request.json()) as {
      title?: string;
      content?: string;
      noteType?: string;
      status?: string;
    };

    const existing = await prisma.note.findFirst({
      where: { id, userId: user.id },
    });
    if (!existing) {
      return NextResponse.json({ error: "笔记不存在" }, { status: 404 });
    }

    const updated = await prisma.note.update({
      where: { id },
      data: {
        title: body.title?.trim() ?? undefined,
        content: body.content?.trim() ?? undefined,
        noteType: body.noteType?.trim() ?? undefined,
        status: body.status?.trim() ?? undefined,
      },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "更新笔记失败" }, { status: 500 });
  }
}
