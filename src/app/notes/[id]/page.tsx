import { notFound } from "next/navigation";
import { NoteDetailEditor } from "@/components/note-detail-editor";
import { getDefaultUser } from "@/lib/default-user";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type NoteDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function NoteDetailPage({ params }: NoteDetailPageProps) {
  let dbError = false;
  let note: Awaited<ReturnType<typeof prisma.note.findFirst>> = null;

  try {
    const { id } = await params;
    const user = await getDefaultUser();
    note = await prisma.note.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });
  } catch {
    dbError = true;
  }

  if (dbError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        笔记详情加载失败：数据库暂时不可用。
      </div>
    );
  }

  if (!note) {
    notFound();
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">笔记详情</h2>
      <NoteDetailEditor note={note} />
    </div>
  );
}
