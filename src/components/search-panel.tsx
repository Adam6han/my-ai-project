"use client";

import { FormEvent, useState } from "react";

type SearchItem = {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
};

export function SearchPanel() {
  const [keyword, setKeyword] = useState("");
  const [items, setItems] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(false);

  async function onSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(keyword)}`);
      const data = (await response.json()) as SearchItem[];
      setItems(data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={onSearch} className="space-y-2">
        <input
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          placeholder="搜索标题、内容、标签或来源..."
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-zinc-900 px-3 py-2 text-sm text-white disabled:opacity-60"
        >
          {loading ? "检索中..." : "开始检索"}
        </button>
      </form>

      <div className="space-y-2">
        {items.map((item) => (
          <article key={item.id} className="rounded-xl border border-zinc-200 p-3">
            <h3 className="text-sm font-semibold">{item.title}</h3>
            <p className="mt-1 line-clamp-2 text-sm text-zinc-700">{item.content}</p>
            <p className="mt-2 text-xs text-zinc-500">
              更新时间：{new Date(item.updatedAt).toLocaleString("zh-CN")}
            </p>
          </article>
        ))}
        {!loading && keyword && items.length === 0 ? (
          <p className="text-sm text-zinc-600">没有找到相关结果。</p>
        ) : null}
      </div>
    </div>
  );
}
