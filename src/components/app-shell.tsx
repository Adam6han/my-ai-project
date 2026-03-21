import { SidebarNav } from "@/components/sidebar-nav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-12 gap-4 px-4 py-4">
        <aside className="col-span-2 rounded-xl border border-zinc-200 bg-white p-4">
          <h1 className="mb-4 text-lg font-semibold">我的知识库</h1>
          <SidebarNav />
        </aside>

        <main className="col-span-7 rounded-xl border border-zinc-200 bg-white p-6">
          {children}
        </main>

        <aside className="col-span-3 rounded-xl border border-zinc-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-zinc-900">上下文面板</h2>
          <p className="mt-2 text-sm text-zinc-600">
            这里将展示关联笔记、反向链接、标签和来源信息。
          </p>
        </aside>
      </div>
    </div>
  );
}
