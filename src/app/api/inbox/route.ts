import { NextResponse } from "next/server";
import { getDefaultUser } from "@/lib/default-user";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getDefaultUser();
    const items = await prisma.note.findMany({
      where: {
        userId: user.id,
        status: "未处理",
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 100,
    });

    return NextResponse.json(items);
  } catch {
    return NextResponse.json({ error: "获取收件箱失败" }, { status: 500 });
  }
}
