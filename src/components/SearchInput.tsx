import React from 'react'
import classNames from 'classnames'
import { Search } from 'lucide-react'
import useConfig from '../utils/useConfig'
import withFormControl from './Inputs/withFormControl'
import Loader from './Loader'

interface SearchInputProps {
  name: string
  value?: string
  mandatory?: boolean
  setValue: (name: string, value: string, mandatory?: boolean) => void
  placeholder?: string
  loading?: boolean
}

const SearchInput = ({ name, value, mandatory, setValue, placeholder, loading }: SearchInputProps) => {
  const {
    branding: { lightTheme },
  } = useConfig()

  const containerClasses = classNames('relative flex items-center rounded-md transition-colors', {
    // Light theme styling
    'bg-black/15 hover:bg-black/25': lightTheme,
    // Dark theme styling
    'bg-white/15 hover:bg-white/25': !lightTheme,
  })

  const inputClasses = classNames(
    'w-full border-0 bg-transparent outline-none',
    'placeholder:text-current placeholder:opacity-40',
    'px-2 py-2.5 text-sm',
    {
      'text-gray-900': lightTheme,
      'text-white': !lightTheme,
    },
  )

  const iconClasses = classNames('flex items-center justify-center h-full pl-3 pr-1 sm:pr-2', {
    'text-gray-500': lightTheme,
    'text-white': !lightTheme,
  })

  return (
    <div className={containerClasses}>
      <div className={iconClasses}>{loading ? <Loader light /> : <Search size={20} />}</div>
      <input
        id={name}
        name={name}
        type="text"
        placeholder={placeholder}
        defaultValue={value}
        className={inputClasses}
        onChange={e => setValue(name, e.target.value, mandatory)}
        aria-label="search"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
      />
    </div>
  )
}

export default withFormControl(SearchInput)
