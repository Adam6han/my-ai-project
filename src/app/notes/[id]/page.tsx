import { notFound } from "next/navigation";
import { NoteDetailEditor } from "@/components/note-detail-editor";
import { getDefaultUser } from "@/lib/default-user";
import { prisma } from "@/lib/prisma";

type NoteDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function NoteDetailPage({ params }: NoteDetailPageProps) {
  const { id } = await params;
  const user = await getDefaultUser();
  const note = await prisma.note.findFirst({
    where: {
      id,
      userId: user.id,
    },
  });

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
