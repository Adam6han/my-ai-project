"use client";

import { FormEvent, useState } from "react";

type NoteDetail = {
  id: string;
  title: string;
  content: string;
  noteType: string;
  status: string;
  updatedAt: string | Date;
};

export function NoteDetailEditor({ note }: { note: NoteDetail }) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const response = await fetch(`/api/notes/${note.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      if (!response.ok) {
        throw new Error("save_failed");
      }
      setMessage("已保存。");
    } catch {
      setMessage("保存失败，请稍后重试。");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-xl border border-zinc-200 p-4">
      <p className="text-xs text-zinc-500">笔记 ID：{note.id}</p>
      <input
        className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
      <textarea
        className="min-h-40 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
        value={content}
        onChange={(event) => setContent(event.target.value)}
      />
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-zinc-900 px-3 py-2 text-sm text-white disabled:opacity-60"
        >
          {saving ? "保存中..." : "保存修改"}
        </button>
        <span className="text-xs text-zinc-500">
          类型：{note.noteType} / 状态：{note.status}
        </span>
        {message ? <span className="text-xs text-zinc-600">{message}</span> : null}
      </div>
    </form>
  );
}
