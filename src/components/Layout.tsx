import React from 'react'

interface LayoutProps {
  appBar: React.ReactNode
  children: React.ReactNode
}

const Layout = ({ appBar, children }: LayoutProps) => {
  return (
    <div className="flex h-dvh h-screen flex-col">
      {appBar}
      <div className="flex flex-1 overflow-hidden">{children}</div>
    </div>
  )
}

export default Layout
