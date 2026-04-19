import { Component, type ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback
      return (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <p className="text-slate-300 text-lg font-medium">Something went wrong.</p>
          <p className="text-slate-500 text-sm max-w-md">{this.state.error?.message}</p>
          <div className="flex gap-4">
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="text-sm text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
            >
              Try again
            </button>
            <Link
              to="/"
              className="text-sm text-teal-400 hover:text-teal-300 underline underline-offset-2"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
