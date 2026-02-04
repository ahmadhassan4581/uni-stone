import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import logo from '../assets/logo.png'

function SideLink({ to, label }) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) =>
        [
          'group relative flex items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold transition',
          isActive
            ? 'bg-slate-900 text-white shadow-sm'
            : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900',
        ].join(' ')
      }
    >
      <span>{label}</span>
      <span className="pointer-events-none absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r bg-white/0 transition group-hover:bg-slate-900/10" />
    </NavLink>
  )
}

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const location = useLocation()

  const titleMap = {
    '/': 'Dashboard',
    '/products': 'Products',
    '/contacts': 'Contacts',
    '/newsletter': 'Newsletter',
    '/orders': 'Orders',
    '/reviews': 'Reviews',
    '/consultations': 'Consultations',
    '/users': 'Users',
  }

  const pageTitle = titleMap[location.pathname] || 'Admin'
  const initials = String(user?.email || 'A')
    .split('@')[0]
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="min-h-dvh bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <div className="flex min-h-dvh">
        <aside className="w-72 border-r border-slate-200 bg-white/80 p-4 backdrop-blur">
          <div className="mb-6 flex items-center gap-3">
            <div className="grid h-16 w-16 place-items-center overflow-hidden rounded-xl bg-white">
              <img src={logo} alt="Unistone" className="h-full w-full object-contain" />
            </div>
          </div>

          <nav className="space-y-2">
            <SideLink to="/" label="Dashboard" />
            <SideLink to="/products" label="Products" />
            <SideLink to="/contacts" label="Contacts" />
            <SideLink to="/newsletter" label="Newsletter" />
            <SideLink to="/orders" label="Orders" />
            <SideLink to="/reviews" label="Reviews" />
            <SideLink to="/consultations" label="Consultations" />
            <SideLink to="/users" label="Users" />
          </nav>

          <div className="mt-8 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-100 text-sm font-bold text-slate-700">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-500">Signed in</p>
                <p className="truncate text-sm font-semibold text-slate-800">{user?.email}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={logout}
              className="mt-3 w-full rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
            >
              Logout
            </button>
          </div>
        </aside>

        <main className="flex-1">
          <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/70 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Admin</p>
                <h1 className="text-xl font-semibold text-slate-900">{pageTitle}</h1>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden text-right sm:block">
                  <p className="text-xs text-slate-500">Signed in as</p>
                  <p className="max-w-[280px] truncate text-sm font-semibold text-slate-800">{user?.email}</p>
                </div>
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-sm font-bold text-slate-700">
                  {initials}
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-6xl p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
