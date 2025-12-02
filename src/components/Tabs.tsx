import React from 'react'
import classNames from 'classnames'
import useConfig from '../utils/useConfig'

interface TabsProps {
  value: string
  onChange: (event: React.ChangeEvent<{}>, value: string) => void
  children: React.ReactNode
  className?: string
}

interface TabProps {
  label: string
  value: string
}

export const Tab = ({ label, value: _value, isActive, onClick }: TabProps & { isActive?: boolean; onClick?: (e: React.MouseEvent) => void }) => {
  const { branding: { themeColor } } = useConfig()

  const activeStyle = isActive && themeColor
    ? {
        borderBottomColor: themeColor,
      }
    : undefined

  return (
    <button
      type="button"
      onClick={onClick}
      className={classNames(
        'relative px-6 py-3 text-sm',
        'border-b-4 border-solid border-t-0 border-l-0 border-r-0',
        'rounded-t bg-gray-200',
        'transition-colors duration-200',
        'outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'cursor-pointer active:scale-[0.98]',
        isActive
          ? themeColor ? 'border-current text-gray-900 -mb-0.5 font-medium' : 'border-blue-600 text-gray-900 -mb-0.5 font-medium'
          : 'border-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-400 font-normal'
      )}
      style={activeStyle}
    >
      {label}
    </button>
  )
}

const Tabs = ({ value, onChange, children, className }: TabsProps) => {
  return (
    <div className={classNames('border-solid border-b-2 border-t-0 border-l-0 border-r-0 border-gray-200', className)}>
      <nav className="flex gap-1">
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && child.type === Tab) {
            const tabValue = (child.props as TabProps).value
            const isActive = value === tabValue

            return React.cloneElement(child, {
              ...child.props,
              isActive,
              onClick: (e: React.MouseEvent) => {
                onChange(e as any, tabValue)
              },
            } as any)
          }
          return child
        })}
      </nav>
    </div>
  )
}

export default Tabs
