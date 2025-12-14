import React from 'react'
import classNames from 'classnames'
import withFormControl from './withFormControl'

interface SelectOption {
  value: string | number
  label: string
  icon?: React.ReactNode
}

interface SelectProps {
  name: string
  value?: string | number | null
  placeholder?: string
  setValue?: (name: string, value: string | number | null, mandatory?: boolean) => void
  mandatory?: boolean
  options?: SelectOption[]
  disabled?: boolean
  validation?: 'error' | 'success'
}

const Select = ({
  name,
  value,
  placeholder,
  setValue,
  mandatory,
  options = [],
  disabled = false,
  validation,
}: SelectProps) => {
  const [localValue, setLocalValue] = React.useState<string | number | null>(value !== undefined ? value : null)
  const [isOpen, setIsOpen] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  // Check if any option has an icon
  const hasIcons = options.some(opt => opt.icon)

  React.useEffect(() => {
    if (value !== undefined) {
      setLocalValue(value)
    }
  }, [value])

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleChange = (newValue: string | number | null) => {
    const parsedValue = newValue !== null && !isNaN(Number(newValue)) ? Number(newValue) : newValue
    setLocalValue(parsedValue)
    if (setValue) {
      setValue(name, parsedValue, mandatory)
    }
    setIsOpen(false)
  }

  const handleNativeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value === '' ? null : e.target.value
    const parsedValue = newValue !== null && !isNaN(Number(newValue)) ? Number(newValue) : newValue
    setLocalValue(parsedValue)
    if (setValue) {
      setValue(name, parsedValue, mandatory)
    }
  }

  const selectedOption = options.find(opt => opt.value === localValue)
  const displayText = selectedOption ? selectedOption.label : placeholder || ''

  const baseClasses = classNames({
    'border-gray-300': !validation,
    'border-red-500 bg-red-50': validation === 'error',
    'border-green-500 bg-green-50': validation === 'success',
  })

  // If no icons, use native select for better UX
  if (!hasIcons) {
    const selectClasses = classNames(
      baseClasses,
      'w-full px-3 py-2.5 border rounded-md',
      'focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent',
      'transition-colors appearance-none',
      'bg-[length:1.5em] bg-[right_0.5rem_center] bg-no-repeat',
      {
        'bg-gray-100 cursor-not-allowed': disabled,
        'bg-gray-50': !disabled && !validation,
      },
    )

    const selectStyle = {
      backgroundImage:
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E\")",
    }

    return (
      <select
        id={name}
        name={name}
        value={localValue !== null ? localValue : ''}
        onChange={handleNativeChange}
        disabled={disabled}
        className={selectClasses}
        style={selectStyle}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    )
  }

  // Custom dropdown with icon support
  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        id={name}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={classNames(
          baseClasses,
          'w-full rounded-md border px-3 py-2.5 text-left',
          'focus:border-transparent focus:outline-none focus:ring-2 focus:ring-gray-700',
          'flex items-center justify-between transition-colors',
          {
            'cursor-not-allowed bg-gray-100': disabled,
            'bg-gray-50': !disabled && !validation,
            'cursor-pointer': !disabled,
          },
        )}
      >
        <span className="flex items-center gap-2">
          {selectedOption?.icon && <span className="flex-shrink-0">{selectedOption.icon}</span>}
          <span className={classNames({ 'text-gray-400': !selectedOption && placeholder })}>{displayText}</span>
        </span>
        <svg
          className={classNames('h-5 w-5 text-gray-400 transition-transform', {
            'rotate-180 transform': isOpen,
          })}
          fill="none"
          viewBox="0 0 20 20"
        >
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 8l4 4 4-4" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-300 bg-white shadow-lg">
          {placeholder && !localValue && (
            <button
              type="button"
              onClick={() => handleChange(null)}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-gray-400 hover:bg-gray-100"
            >
              {placeholder}
            </button>
          )}
          {options.map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleChange(option.value)}
              className={classNames('flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-gray-100', {
                'bg-blue-50': option.value === localValue,
              })}
            >
              {option.icon && <span className="flex-shrink-0">{option.icon}</span>}
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default withFormControl(Select)
