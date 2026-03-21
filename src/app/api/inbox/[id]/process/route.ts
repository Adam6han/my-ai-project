import { NextResponse } from "next/server";
import { getDefaultUser } from "@/lib/default-user";
import { prisma } from "@/lib/prisma";

type ProcessPayload = {
  title?: string;
  noteType?: string;
  paraType?: string;
  paraName?: string;
  tags?: string[];
};

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const user = await getDefaultUser();
    const payload = (await request.json()) as ProcessPayload;
    const title = payload.title?.trim();
    const paraType = payload.paraType?.trim();
    const paraName = payload.paraName?.trim();
    const tags = (payload.tags ?? []).map((tag) => tag.trim()).filter(Boolean);

    const existing = await prisma.note.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "收件箱条目不存在" }, { status: 404 });
    }

    const updated = await prisma.note.update({
      where: { id },
      data: {
        status: "已处理",
        title: title || undefined,
        noteType: payload.noteType?.trim() || "原子笔记",
      },
    });

    if (paraType && paraName) {
      const para = await prisma.paraNode.upsert({
        where: {
          userId_name: {
            userId: user.id,
            name: paraName,
          },
        },
        update: {
          paraType,
        },
        create: {
          userId: user.id,
          paraType,
          name: paraName,
        },
      });

      await prisma.notePara.upsert({
        where: {
          noteId_paraId: {
            noteId: id,
            paraId: para.id,
          },
        },
        update: {},
        create: {
          noteId: id,
          paraId: para.id,
        },
      });
    }

    if (tags.length > 0) {
      for (const tagName of tags) {
        const tag = await prisma.tag.upsert({
          where: {
            userId_name: {
              userId: user.id,
              name: tagName,
            },
          },
          update: {},
          create: {
            userId: user.id,
            name: tagName,
          },
        });

        await prisma.noteTag.upsert({
          where: {
            noteId_tagId: {
              noteId: id,
              tagId: tag.id,
            },
          },
          update: {},
          create: {
            noteId: id,
            tagId: tag.id,
          },
        });
      }
    }

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "整理收件箱条目失败" }, { status: 500 });
  }
}
