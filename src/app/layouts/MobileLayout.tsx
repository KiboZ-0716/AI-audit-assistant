import { Outlet } from 'react-router-dom'

export function MobileLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white px-4 py-3">
        <div className="text-sm font-semibold text-slate-800">AI 智能审核助手 · 移动端</div>
      </header>
      <main className="mx-auto max-w-md px-4 py-4">
        <Outlet />
      </main>
    </div>
  )
}
