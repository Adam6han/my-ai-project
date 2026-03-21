import { InboxList } from "@/components/inbox-list";
import { getDefaultUser } from "@/lib/default-user";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function InboxPage() {
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

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">收件箱</h2>
      <p className="text-sm text-zinc-600">先收集，后整理。以下内容等待你处理。</p>
      <InboxList items={items} />
    </div>
  );
}
