import React from 'react'
import classNames from 'classnames'

interface ButtonGroupProps {
  children: React.ReactNode
  className?: string
}

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(({ children, className }, ref) => {
  const allClasses = classNames('inline-flex gap-1', className)

  return (
    <div ref={ref} className={allClasses} role="group">
      {children}
    </div>
  )
})

ButtonGroup.displayName = 'ButtonGroup'

export default ButtonGroup
