import type React from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="flex h-screen w-full flex-col items-center">{children}</div>
}
