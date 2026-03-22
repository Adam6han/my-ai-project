import { InboxList } from "@/components/inbox-list";
import { getDefaultUser } from "@/lib/default-user";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function InboxPage() {
  let dbError = false;
  let items: Awaited<ReturnType<typeof prisma.note.findMany>> = [];

  try {
    const user = await getDefaultUser();
    items = await prisma.note.findMany({
      where: {
        userId: user.id,
        status: "未处理",
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 100,
    });
  } catch {
    dbError = true;
  }

  if (dbError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        收件箱加载失败：数据库暂时不可用。
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">收件箱</h2>
      <p className="text-sm text-zinc-600">先收集，后整理。以下内容等待你处理。</p>
      <InboxList items={items} />
    </div>
  );
}
