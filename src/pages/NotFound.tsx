import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
      <p className="text-8xl font-bold font-mono text-slate-700">404</p>
      <p className="text-slate-300 text-lg font-medium">Page not found.</p>
      <p className="text-slate-500 text-sm">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="mt-4 text-teal-400 hover:text-teal-300 text-sm underline underline-offset-2"
      >
        ← Back to Dashboard
      </Link>
    </div>
  )
}
