import React from 'react'
import classNames from 'classnames'
import useConfig from '../utils/useConfig'

interface IconButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement> & React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  size?: 'small' | 'medium' | 'large'
  variant?: 'default' | 'transparent' | 'bordered'
  children: React.ReactNode
  href?: string
}

const IconButton = ({
  size = 'medium',
  variant = 'default',
  className,
  style,
  children,
  href,
  ...props
}: IconButtonProps) => {
  const { branding: { themeColor, secondaryColor } } = useConfig()
  const sizeClasses = {
    small: 'p-1',
    medium: 'p-2',
    large: 'p-3',
  }

  const variantClasses = {
    default: 'bg-gray-200 hover:bg-gray-100 text-gray-800 border-none',
    transparent: 'bg-transparent hover:bg-white/25 text-white border-none',
    bordered: 'bg-transparent hover:opacity-90 text-white border-2 border-white',
  }

  // For bordered variant, apply theme color as background
  const getBorderedStyle = () => {
    if (variant === 'bordered') {
      return {
        backgroundColor: secondaryColor || themeColor,
        ...style,
      }
    }
    return style
  }

  const Component = href ? 'a' : 'button'

  return (
    <Component
      type={href ? undefined : 'button'}
      href={href}
      className={classNames(
        'inline-flex items-center justify-center rounded-full transition-colors cursor-pointer',
        'outline-none focus:outline-none',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      style={getBorderedStyle()}
      {...(props as any)}
    >
      {children}
    </Component>
  )
}

export default IconButton
