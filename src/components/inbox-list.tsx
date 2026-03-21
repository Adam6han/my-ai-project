"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type InboxItem = {
  id: string;
  title: string;
  content: string;
  updatedAt: string | Date;
};

export function InboxList({ items }: { items: InboxItem[] }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function processItem(item: InboxItem) {
    setLoadingId(item.id);
    try {
      const response = await fetch(`/api/inbox/${item.id}/process`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: item.title === "未命名收集" ? item.content.slice(0, 20) : item.title,
          noteType: "原子笔记",
          paraType: "Resource",
          paraName: "默认资源",
          tags: ["待回顾"],
        }),
      });
      if (!response.ok) {
        throw new Error("process_failed");
      }
      router.refresh();
    } finally {
      setLoadingId(null);
    }
  }

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 p-4 text-sm text-zinc-600">
        收件箱为空，去首页记录一条想法吧。
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className="rounded-xl border border-zinc-200 p-4">
          <h3 className="text-sm font-semibold">{item.title}</h3>
          <p className="mt-2 text-sm text-zinc-700">{item.content}</p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-zinc-500">
              更新时间：{new Date(item.updatedAt).toLocaleString("zh-CN")}
            </span>
            <button
              onClick={() => processItem(item)}
              disabled={loadingId === item.id}
              className="rounded-lg bg-zinc-900 px-3 py-1.5 text-xs text-white disabled:opacity-60"
            >
              {loadingId === item.id ? "处理中..." : "整理入库"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
