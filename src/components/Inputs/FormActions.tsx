import React from 'react'
import classNames from 'classnames'

interface FormActionsProps {
  children?: React.ReactNode
  className?: string
  align?: 'left' | 'center' | 'right' | 'space-between'
}

const FormActions = ({ children, className, align = 'right' }: FormActionsProps) => {
  const alignmentClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    'space-between': 'justify-between',
  }

  const containerClasses = classNames('flex flex-wrap items-center gap-2 mt-6', alignmentClasses[align], className)

  return <div className={containerClasses}>{children}</div>
}

export default FormActions
