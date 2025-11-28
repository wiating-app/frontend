import React from 'react'
import classNames from 'classnames'

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'small' | 'medium' | 'large'
  transparent?: boolean
  children: React.ReactNode
}

const IconButton = ({
  size = 'medium',
  transparent = false,
  className,
  children,
  ...props
}: IconButtonProps) => {
  const sizeClasses = {
    small: 'p-1',
    medium: 'p-2',
    large: 'p-3',
  }

  return (
    <button
      type="button"
      className={classNames(
        'inline-flex items-center justify-center rounded-full transition-colors cursor-pointer',
        'border-none outline-none focus:outline-none',
        transparent ? 'bg-transparent hover:bg-white/25 text-white' : 'bg-gray-200 hover:bg-gray-100 text-gray-800',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export default IconButton
