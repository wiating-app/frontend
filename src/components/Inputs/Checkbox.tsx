import React from 'react'
import classNames from 'classnames'
import withFormControl from './withFormControl'

interface CheckboxProps {
  name: string
  value?: boolean
  text?: string
  setValue?: (name: string, value: boolean, mandatory?: boolean) => void
  mandatory?: boolean
  disabled?: boolean
}

const Checkbox = ({
  name,
  value = false,
  text,
  setValue,
  mandatory,
  disabled = false,
}: CheckboxProps) => {
  const [localValue, setLocalValue] = React.useState(value)

  React.useEffect(() => {
    if (value !== undefined) {
      setLocalValue(value)
    }
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.checked
    setLocalValue(newValue)
    if (setValue) {
      setValue(name, newValue, mandatory)
    }
  }

  return (
    <div className="flex items-center">
      <input
        id={name}
        name={name}
        type="checkbox"
        checked={localValue}
        onChange={handleChange}
        disabled={disabled}
        className={classNames(
          'w-4 h-4 text-gray-700 border-gray-300 rounded',
          'focus:ring-2 focus:ring-gray-700',
          'cursor-pointer',
          {
            'opacity-50 cursor-not-allowed': disabled,
          }
        )}
      />
      {text && (
        <label
          htmlFor={name}
          className={classNames('ml-2 text-sm text-gray-700', {
            'cursor-pointer': !disabled,
            'cursor-not-allowed opacity-50': disabled,
          })}
        >
          {text}
        </label>
      )}
    </div>
  )
}

export default withFormControl(Checkbox)
