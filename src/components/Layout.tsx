import React from 'react'

interface LayoutProps {
  appBar: React.ReactNode
  children: React.ReactNode
}

const Layout = ({ appBar, children }: LayoutProps) => {
  const [documentHeight, setDocumentHeight] = React.useState<string>()

  React.useEffect(() => {
    // Correct sizing of viewport on mobile.
    const resizeListener = () => {
      setDocumentHeight(`${window.innerHeight}px`)
    }
    // Set size initially.
    resizeListener()
    // Set resize listener
    window.addEventListener('resize', resizeListener)
    // Clean up function
    return () => {
      window.removeEventListener('resize', resizeListener)
    }
  }, [])

  return (
    <div
      className="flex flex-col h-screen"
      style={documentHeight ? { height: documentHeight } : {}}
    >
      {appBar}
      <div className="flex-1 flex overflow-hidden">
        {children}
      </div>
    </div>
  )
}

export default Layout
