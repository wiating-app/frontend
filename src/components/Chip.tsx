import React from 'react'
import classNames from 'classnames'
import useConfig from '../utils/useConfig'

interface ChipProps {
  size?: 'small' | 'medium'
  color?: 'default' | 'primary' | 'secondary'
  label: React.ReactNode
  className?: string
}

const Chip = ({ size = 'medium', color = 'default', label, className }: ChipProps) => {
  const {
    branding: { themeColor, secondaryColor },
  } = useConfig()

  // Get color value based on color prop
  const getColorValue = () => {
    if (color === 'primary') return themeColor
    if (color === 'secondary') return secondaryColor || themeColor
    return undefined
  }

  const colorValue = getColorValue()

  // Size classes
  const sizeClasses = {
    small: 'px-2 py-0.5 text-xs',
    medium: 'px-2.5 py-1 text-xs',
  }

  // Color class mappings
  const colorClasses = {
    default: 'bg-gray-200 text-gray-800',
    primary: colorValue ? 'text-white' : 'bg-blue-600 text-white',
    secondary: colorValue ? 'text-white' : 'bg-blue-600 text-white',
  }

  // Build classes
  const allClasses = classNames(
    // Base classes
    'inline-flex items-center justify-center text-center font-medium rounded-full',
    // Size
    sizeClasses[size],
    // Color classes
    colorClasses[color],
    // Custom classes
    className,
  )

  // Inline styles for dynamic colors
  const getStyle = () => {
    if (!colorValue) return {}

    if (color === 'primary' || color === 'secondary') {
      return {
        backgroundColor: colorValue,
        color: '#ffffff',
      }
    }

    return {}
  }

  const style = getStyle()

  return (
    <span className={allClasses} style={style}>
      {label}
    </span>
  )
}

export default Chip
