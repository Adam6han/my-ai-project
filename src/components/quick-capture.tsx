"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function QuickCapture() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!content.trim()) {
      setMessage("请输入内容后再保存。");
      return;
    }

    setIsSubmitting(true);
    setMessage("");
    try {
      const response = await fetch("/api/inbox/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (!response.ok) {
        throw new Error("capture_failed");
      }
      setContent("");
      setMessage("已保存到收件箱。");
      router.refresh();
    } catch {
      setMessage("保存失败，请稍后重试。");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-xl border border-zinc-200 p-4">
      <label htmlFor="quick-capture" className="mb-2 block text-sm font-medium">
        快速记录
      </label>
      <textarea
        id="quick-capture"
        className="min-h-24 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none ring-zinc-300 focus:ring"
        placeholder="记录一个想法..."
        value={content}
        onChange={(event) => setContent(event.target.value)}
      />
      <div className="mt-3 flex items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-zinc-900 px-3 py-2 text-sm text-white disabled:opacity-60"
        >
          {isSubmitting ? "保存中..." : "保存到收件箱"}
        </button>
        {message ? <p className="text-sm text-zinc-600">{message}</p> : null}
      </div>
    </form>
  );
}
