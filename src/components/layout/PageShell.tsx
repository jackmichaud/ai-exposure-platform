import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function PageShell({ children }: Props) {
  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      {children}
    </main>
  )
}
