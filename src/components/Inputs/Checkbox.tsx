import React from 'react'
import withFormControl from './withFormControl'
import classNames from 'classnames'

interface CheckboxProps {
  name: string
  value?: boolean
  text?: string
  setValue?: (name: string, value: boolean, mandatory?: boolean) => void
  mandatory?: boolean
  disabled?: boolean
}

const Checkbox = ({ name, value = false, text, setValue, mandatory, disabled = false }: CheckboxProps) => {
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
          'h-4 w-4 rounded border-gray-300 text-gray-700',
          'focus:ring-2 focus:ring-gray-700',
          'cursor-pointer',
          {
            'cursor-not-allowed opacity-50': disabled,
          },
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
