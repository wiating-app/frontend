import React from 'react'
import classNames from 'classnames'

interface TypographyProps {
  variant?: 'body1' | 'body2' | 'subtitle1' | 'subtitle2' | 'caption'
  className?: string
  children?: React.ReactNode
  gutterBottom?: boolean
  color?: 'inherit' | 'error'
}

const Typography = ({
  variant = 'body1',
  className,
  children,
  gutterBottom = false,
  color = 'inherit',
}: TypographyProps) => {
  // Variant class mappings
  const variantClasses: Record<string, string> = {
    body1: 'text-base',
    body2: 'text-sm',
    subtitle1: 'text-base font-medium',
    subtitle2: 'text-sm font-medium',
    caption: 'text-xs',
  }

  // Color class mappings
  const colorClasses: Record<string, string> = {
    inherit: 'text-inherit',
    error: 'text-red-600',
  }

  // Build classes
  const allClasses = classNames(
    variantClasses[variant],
    colorClasses[color],
    gutterBottom && 'mb-4',
    className
  )

  return (
    <div className={allClasses}>
      {children}
    </div>
  )
}

export default Typography
