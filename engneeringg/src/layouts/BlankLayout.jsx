import { Outlet } from 'react-router-dom'

export default function BlankLayout() {
  return (
    <div className="min-h-dvh bg-white text-obsidian">
      <main>
        <Outlet />
      </main>
    </div>
  )
}
