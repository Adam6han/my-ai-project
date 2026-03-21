import { NextResponse } from "next/server";
import { getDefaultUser } from "@/lib/default-user";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      content?: string;
      title?: string;
    };
    const content = body.content?.trim();

    if (!content) {
      return NextResponse.json({ error: "请输入要记录的内容" }, { status: 400 });
    }

    const user = await getDefaultUser();
    const note = await prisma.note.create({
      data: {
        userId: user.id,
        title: body.title?.trim() || "未命名收集",
        content,
        status: "未处理",
        noteType: "摘录",
      },
    });

    return NextResponse.json(note, { status: 201 });
  } catch {
    return NextResponse.json({ error: "创建收集条目失败" }, { status: 500 });
  }
}
