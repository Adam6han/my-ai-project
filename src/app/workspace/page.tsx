export default function WorkspacePage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">输出工作台</h2>
      <div className="grid grid-cols-3 gap-3 text-sm">
        <section className="rounded-xl border border-zinc-200 p-4">
          <h3 className="font-semibold">素材池</h3>
          <p className="mt-2 text-zinc-600">从笔记中拖入片段到此区域。</p>
        </section>
        <section className="rounded-xl border border-zinc-200 p-4">
          <h3 className="font-semibold">大纲</h3>
          <p className="mt-2 text-zinc-600">先组织结构，再进入正文写作。</p>
        </section>
        <section className="rounded-xl border border-zinc-200 p-4">
          <h3 className="font-semibold">正文</h3>
          <p className="mt-2 text-zinc-600">支持引用笔记并保留来源链接。</p>
        </section>
      </div>
    </div>
  );
}
