import React from 'react'
import ReactLoading from 'react-loading'
import Button, { type ButtonProps } from '../Button'

interface SubmitButtonProps extends Pick<ButtonProps, 'variant' | 'size' | 'className' | 'disabled'> {
  children?: React.ReactNode
  onClick?: (fields: any) => void | Promise<void>
  loading?: boolean
}

const SubmitButton = ({
  children,
  onClick,
  disabled = false,
  loading = false,
  variant = 'default',
  size = 'medium',
  className,
}: SubmitButtonProps) => {
  return (
    <Button
      variant={variant}
      size={size}
      disabled={disabled || loading}
      className={className}
      onClick={(e) => {
        if (onClick) {
          e.preventDefault()
          onClick(e as any)
        }
      }}
    >
      {loading
        ? (
            <span className="flex items-center gap-2">
              <ReactLoading
                type='spinningBubbles'
                width={18}
                height={18}
                color='white'
              />
              {children}
            </span>
          )
        : children}
    </Button>
  )
}

export default SubmitButton
