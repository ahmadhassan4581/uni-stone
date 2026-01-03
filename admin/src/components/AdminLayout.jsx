import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function SideLink({ to, label }) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) =>
        [
          'block rounded-md px-3 py-2 text-sm font-medium transition',
          isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100',
        ].join(' ')
      }
    >
      {label}
    </NavLink>
  )
}

export default function AdminLayout() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-dvh bg-slate-50 text-slate-900">
      <div className="flex min-h-dvh">
        <aside className="w-64 border-r border-slate-200 bg-white p-4">
          <div className="mb-6">
            <p className="text-xs font-semibold tracking-widest text-slate-500">ADMIN PANEL</p>
            <p className="mt-2 text-lg font-semibold">Aurum Civil</p>
          </div>

          <nav className="space-y-2">
            <SideLink to="/" label="Dashboard" />
            <SideLink to="/products" label="Products" />
            <SideLink to="/contacts" label="Contacts" />
            <SideLink to="/orders" label="Orders" />
            <SideLink to="/users" label="Users" />
          </nav>

          <div className="mt-8 border-t border-slate-200 pt-4">
            <p className="text-xs text-slate-500">Signed in as</p>
            <p className="mt-1 truncate text-sm font-medium">{user?.email}</p>
            <button
              type="button"
              onClick={logout}
              className="mt-3 w-full rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Logout
            </button>
          </div>
        </aside>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
