export default function SettingsPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">设置</h2>
      <div className="rounded-xl border border-zinc-200 p-4 text-sm text-zinc-700">
        <p>语言：简体中文</p>
        <p className="mt-2">时区：Asia/Shanghai</p>
        <p className="mt-2">后续可配置：导入导出、AI 辅助、主题。</p>
      </div>
    </div>
  );
}
