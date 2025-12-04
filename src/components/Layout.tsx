import React from 'react'

interface LayoutProps {
  appBar: React.ReactNode
  children: React.ReactNode
}

const Layout = ({ appBar, children }: LayoutProps) => {
  return (
    <div className="flex flex-col h-screen h-dvh">
      {appBar}
      <div className="flex-1 flex overflow-hidden">
        {children}
      </div>
    </div>
  )
}

export default Layout
