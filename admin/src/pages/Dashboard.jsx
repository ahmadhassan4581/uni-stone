import { Link } from 'react-router-dom'

function Card({ title, description, to }) {
  return (
    <Link to={to} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-slate-300">
      <p className="text-sm font-semibold">{title}</p>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
      <p className="mt-4 text-xs font-semibold text-slate-900">Open</p>
    </Link>
  )
}

export default function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-1 text-sm text-slate-600">Manage your storefront data and submissions.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card title="Products" description="Add, edit, and remove products." to="/products" />
        <Card title="Contacts" description="View contact form submissions." to="/contacts" />
        <Card title="Orders" description="View customer orders." to="/orders" />
        <Card title="Users" description="View registered users." to="/users" />
      </div>
    </div>
  )
}
