import React from 'react'

interface ContentWrapperProps {
  children: React.ReactNode
}

const ContentWrapper = ({ children }: ContentWrapperProps) => {
  return <div className="xs:pr-6 relative flex-grow p-4">{children}</div>
}

export default ContentWrapper
