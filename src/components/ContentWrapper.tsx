import React from 'react'

interface ContentWrapperProps {
  children: React.ReactNode
}

const ContentWrapper = ({ children }: ContentWrapperProps) => {
  return (
    <div className="p-4 relative flex-grow xs:pr-6">{children}</div>
  )
}

export default ContentWrapper
