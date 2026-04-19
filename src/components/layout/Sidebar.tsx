import { NavLink } from 'react-router-dom'

const navLinks = [
  { to: '/', label: 'Dashboard' },
  { to: '/research', label: 'Research' },
  { to: '/debate', label: 'Debate Arena' },
]

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-48 shrink-0 pt-8 pr-4">
      <nav className="flex flex-col gap-1">
        {navLinks.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                isActive
                  ? 'text-teal-400 bg-teal-900/30'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
