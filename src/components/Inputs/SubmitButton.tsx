import React from 'react'
import ReactLoading from 'react-loading'
import Button, { type ButtonProps } from '../Button'
import { useSubmit } from 'react-form-component'

interface SubmitButtonProps extends Pick<ButtonProps, 'variant' | 'size' | 'className' | 'disabled'> {
  children?: React.ReactNode
  onClick?: (fields: any) => void | Promise<void>
  loading?: boolean
  reset?: boolean
  suppressErrorMessage?: boolean
}

const SubmitButton = ({
  children,
  onClick,
  disabled = false,
  loading = false,
  variant = 'default',
  size = 'medium',
  reset,
  suppressErrorMessage = false,
  className,
}: SubmitButtonProps) => {
  const submit = useSubmit(suppressErrorMessage)
  return (
    <Button
      variant={variant}
      size={size}
      disabled={disabled || loading}
      className={className}
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if (onClick) {
          submit(e, onClick, reset)
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
