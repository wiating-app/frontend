import React from 'react'
import classNames from 'classnames'

interface HeadingProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6
  className?: string
  children?: React.ReactNode
  gutterBottom?: boolean
}

const Heading = ({ level = 2, className, children, gutterBottom = false }: HeadingProps) => {
  // Level class mappings
  const levelClasses: Record<number, string> = {
    1: 'text-6xl font-light',
    2: 'text-5xl font-light',
    3: 'text-4xl font-normal',
    4: 'text-3xl font-normal',
    5: 'text-2xl font-normal',
    6: 'text-xl font-medium',
  }

  // Build classes
  const allClasses = classNames(levelClasses[level], gutterBottom && 'mb-4', className)

  const Component = `h${level}` as keyof JSX.IntrinsicElements

  return <Component className={allClasses}>{children}</Component>
}

export default Heading
