import React from 'react'
import classNames from 'classnames'
import { Link } from 'react-router-dom'
import useConfig from '../utils/useConfig'

export type ButtonProps = {
  variant?: 'default' | 'primary' | 'secondary' | 'bare' | 'danger' | 'success'
  size?: 'small' | 'medium' | 'large'
  href?: string
  className?: string
  disabled?: boolean
  onClick?: React.MouseEventHandler<HTMLElement>
  children?: React.ReactNode
  target?: string
  rel?: string
  type?: 'button' | 'submit' | 'reset'
  id?: string
  role?: string
  title?: string
  to?: string
}

const Button = ({
  variant = 'default',
  size = 'medium',
  className,
  children,
  href,
  disabled = false,
  onClick,
  target,
  rel,
  type = 'button',
  id,
  role,
  title,
  to,
}: ButtonProps) => {
  const {
    branding: { themeColor, secondaryColor },
  } = useConfig()

  // Get color value based on variant
  const getColorValue = () => {
    if (variant === 'primary') return themeColor
    if (variant === 'secondary') return secondaryColor || themeColor
    return undefined
  }

  const colorValue = getColorValue()
  const isThemedVariant = variant === 'primary' || variant === 'secondary'

  // Size classes
  const sizeClasses = {
    small: 'px-2 py-1 text-xs',
    medium: 'px-4 py-2 text-sm',
    large: 'px-6 py-2 text-base',
  }

  // Variant class mappings
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
    primary: colorValue ? 'text-white hover:opacity-90' : 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: colorValue ? 'text-white hover:opacity-90' : 'bg-blue-600 hover:bg-blue-700 text-white',
    bare: 'bg-transparent text-gray-700 hover:bg-gray-100',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    success: 'bg-green-700 text-white hover:bg-green-800',
  }

  // Build classes
  const allClasses = classNames(
    // Base classes
    'inline-flex items-center justify-center gap-1 font-medium rounded transition-colors no-underline border-0',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    // Size
    sizeClasses[size],
    // Variant classes
    variantClasses[variant],
    // Disabled state
    disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer',
    // Custom classes
    className,
  )

  // Inline styles for dynamic colors
  const getStyle = () => {
    if (!colorValue || !isThemedVariant) return {}

    if (variant === 'primary' || variant === 'secondary') {
      return {
        backgroundColor: colorValue,
        color: '#ffffff',
      }
    }

    return {}
  }

  const style = getStyle()

  // Render as anchor if href is provided
  if (href || to) {
    const Component = to ? Link : 'a'
    return (
      <Component
        href={href}
        className={allClasses}
        style={style}
        onClick={onClick}
        target={target}
        rel={rel}
        disabled={disabled}
        id={id}
        role={role}
        title={title}
        to={to}
      >
        {children}
      </Component>
    )
  }

  // Render as button
  return (
    <button
      type={type}
      className={allClasses}
      style={style}
      onClick={onClick}
      disabled={disabled}
      id={id}
      role={role}
      title={title}
    >
      {children}
    </button>
  )
}

export default Button
