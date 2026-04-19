import { ReactNode } from 'react'
import Sidebar from './Sidebar'

interface Props {
  children: ReactNode
}

export default function PageShell({ children }: Props) {
  return (
    <div className="flex max-w-7xl mx-auto">
      <Sidebar />
      <main className="flex-1 min-w-0 px-6 py-8">{children}</main>
    </div>
  )
}
