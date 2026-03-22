import Link from "next/link";
import { getDefaultUser } from "@/lib/default-user";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function NotesPage() {
  let dbError = false;
  let notes: Awaited<ReturnType<typeof prisma.note.findMany>> = [];

  try {
    const user = await getDefaultUser();
    notes = await prisma.note.findMany({
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
  } catch {
    dbError = true;
  }

  if (dbError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        笔记库加载失败：数据库暂时不可用。
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">笔记库</h2>
      <p className="text-sm text-zinc-600">所有已整理的笔记都在这里。</p>

      <div className="grid grid-cols-2 gap-3">
        {notes.map((note) => (
          <article key={note.id} className="rounded-xl border border-zinc-200 p-4">
            <Link href={`/notes/${note.id}`} className="text-sm font-semibold hover:underline">
              {note.title}
            </Link>
            <p className="mt-2 line-clamp-2 text-xs text-zinc-600">{note.content}</p>
            <p className="mt-2 text-xs text-zinc-500">
              更新时间：{new Date(note.updatedAt).toLocaleString("zh-CN")}
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              标签：
              {note.tags.length > 0
                ? note.tags.map((tagLink) => tagLink.tag.name).join("、")
                : "无"}
            </p>
          </article>
        ))}
        {notes.length === 0 ? (
          <p className="text-sm text-zinc-600">暂无已处理笔记，请先在收件箱整理内容。</p>
        ) : null}
      </div>
    </div>
  );
}
