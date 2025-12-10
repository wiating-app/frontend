import React from 'react'
import withFormControl from './withFormControl'
import classNames from 'classnames'

interface InputProps {
  name: string
  value?: string
  placeholder?: string
  setValue?: (name: string, value: string, mandatory?: boolean, options?: any) => void
  mandatory?: boolean
  min?: number
  max?: number
  multiline?: boolean
  disabled?: boolean
  type?: string // HTML input type or custom validation type (e.g., 'text', 'email', 'coordinates')
  validation?: 'error' | 'success'
  onChange?: (value: string) => void
}

const Input = ({
  name,
  value = '',
  placeholder,
  setValue,
  mandatory,
  min,
  max,
  multiline = false,
  disabled = false,
  type = 'text',
  validation,
  onChange,
}: InputProps) => {
  const [localValue, setLocalValue] = React.useState(value || '')

  // Standard HTML input types
  const htmlInputTypes = [
    'text',
    'email',
    'password',
    'number',
    'tel',
    'url',
    'search',
    'date',
    'time',
    'datetime-local',
  ]
  const isCustomValidationType = !htmlInputTypes.includes(type)
  const inputType = isCustomValidationType ? 'text' : type

  React.useEffect(() => {
    if (value !== undefined) {
      setLocalValue(value)
    }
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value
    setLocalValue(newValue)
    if (setValue) {
      const options = isCustomValidationType ? { type } : undefined
      setValue(name, newValue, mandatory, options)
    }
    if (onChange) {
      onChange(newValue)
    }
  }

  const baseInputClasses = classNames(
    'w-full px-3 py-2.5 border rounded-md',
    'focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent',
    'transition-colors',
    {
      'bg-gray-100 cursor-not-allowed': disabled,
      'bg-gray-50': !disabled && !validation,
      'border-gray-300': !validation,
      'border-red-500 bg-red-50': validation === 'error',
      'border-green-500 bg-green-50': validation === 'success',
    },
  )

  if (multiline) {
    return (
      <textarea
        id={name}
        name={name}
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        minLength={min}
        maxLength={max}
        className={classNames(baseInputClasses, 'resize-vertical min-h-[100px]')}
      />
    )
  }

  return (
    <input
      id={name}
      name={name}
      type={inputType}
      value={localValue}
      onChange={handleChange}
      placeholder={placeholder}
      disabled={disabled}
      minLength={min}
      maxLength={max}
      className={baseInputClasses}
    />
  )
}

export default withFormControl(Input)
