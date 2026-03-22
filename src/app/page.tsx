import { getDefaultUser } from "@/lib/default-user";
import { prisma } from "@/lib/prisma";
import { QuickCapture } from "@/components/quick-capture";

export const dynamic = "force-dynamic";

export default async function Home() {
  let dbError = false;
  let pendingCount = 0;
  let latestNotes: { title: string }[] = [];

  try {
    const user = await getDefaultUser();
    const [pending, latest] = await Promise.all([
      prisma.note.count({
        where: {
          userId: user.id,
          status: "未处理",
        },
      }),
      prisma.note.findMany({
        where: { userId: user.id },
        orderBy: { updatedAt: "desc" },
        take: 2,
      }),
    ]);
    pendingCount = pending;
    latestNotes = latest;
  } catch {
    dbError = true;
  }

  if (dbError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        当前无法连接数据库，请稍后重试或检查部署环境变量 `DATABASE_URL`。
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">今日工作台</h2>
        <p className="text-sm text-zinc-600">从这里开始收集灵感，并推进收件箱整理。</p>
      </section>

      <QuickCapture />

      <section className="grid grid-cols-2 gap-4">
        <article className="rounded-xl border border-zinc-200 p-4">
          <h3 className="text-sm font-semibold">待处理收件箱</h3>
          <p className="mt-2 text-sm text-zinc-600">你有 {pendingCount} 条内容等待整理。</p>
        </article>
        <article className="rounded-xl border border-zinc-200 p-4">
          <h3 className="text-sm font-semibold">最近编辑</h3>
          <p className="mt-2 text-sm text-zinc-600">
            {latestNotes.length > 0
              ? latestNotes.map((item) => item.title).join("、")
              : "暂无最近编辑内容。"}
          </p>
        </article>
      </section>
    </div>
  );
}
