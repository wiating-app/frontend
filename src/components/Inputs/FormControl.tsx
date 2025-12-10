import React from 'react'
import classNames from 'classnames'

export interface FormControlProps {
  name?: string
  inlineLabel?: boolean
  narrow?: boolean
  noBottomGutter?: boolean
  validation?: 'error' | 'success'
  disabled?: boolean
  displayName?: string
  label?: React.ReactNode
  help?: React.ReactNode
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  className?: string
  children?: React.ReactNode
}

const FormControl = ({
  name,
  inlineLabel,
  narrow,
  noBottomGutter,
  validation,
  disabled,
  displayName = 'Input',
  label,
  help,
  prefix,
  suffix,
  className = '',
  children,
}: FormControlProps) => {
  const isCheckboxLike =
    displayName &&
    ['Checkbox', 'CheckboxList', 'Radio', 'Switch', 'SwitchList'].some(item => displayName.includes(item))

  const containerClasses = classNames(
    'group relative w-full max-w-full box-border overflow-visible',
    {
      // Bottom gutter
      'mb-4': !noBottomGutter,
      'mb-0': noBottomGutter,

      // Inline label (desktop)
      'sm:flex sm:w-full': inlineLabel,

      // Narrow width
      'sm:max-w-md': narrow,

      // Disabled state
      'opacity-50 cursor-not-allowed': disabled,
    },
    className,
  )

  const labelClasses = classNames(
    'block m-0 text-sm font-base text-gray-500 transition-colors',
    'group-focus-within:text-gray-900',
    {
      'mb-1': !inlineLabel && !isCheckboxLike,
      'mb-0': inlineLabel || isCheckboxLike,
      'sm:mb-0 sm:mr-2.5 sm:min-w-[150px] sm:max-w-[150px] sm:whitespace-nowrap': inlineLabel,
      'text-red-600': validation === 'error',
      'text-green-600': validation === 'success',
    },
  )

  const helpClasses = classNames('block text-xs text-gray-600 mt-1', {
    'sm:ml-[160px]': inlineLabel,
    'text-red-600': validation === 'error',
    'text-green-600': validation === 'success',
  })

  const prefixClasses = classNames('absolute bottom-0 left-3 flex items-center text-sm', {
    'text-red-600': validation === 'error',
    'text-green-600': validation === 'success',
    'pointer-events-none': disabled,
  })

  const suffixClasses = classNames('absolute bottom-0 right-3 flex items-center text-sm', {
    'text-red-600': validation === 'error',
    'text-green-600': validation === 'success',
    'pointer-events-none': disabled,
  })

  const LabelElement = isCheckboxLike ? 'span' : 'label'

  return (
    <div className={containerClasses}>
      {label && (
        <LabelElement className={labelClasses} htmlFor={isCheckboxLike ? undefined : name}>
          {label}
        </LabelElement>
      )}

      <div className={classNames({ 'sm:flex-grow': inlineLabel })}>
        {children}

        {prefix && <div className={prefixClasses}>{prefix}</div>}
        {suffix && <div className={suffixClasses}>{suffix}</div>}
      </div>

      {help && <span className={helpClasses}>{help}</span>}
    </div>
  )
}

export default FormControl
