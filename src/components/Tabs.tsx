import React from 'react'
import useConfig from '../utils/useConfig'
import classNames from 'classnames'

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

export const Tab = ({
  label,
  value: _value,
  isActive,
  onClick,
}: TabProps & { isActive?: boolean; onClick?: (e: React.MouseEvent) => void }) => {
  const {
    branding: { themeColor },
  } = useConfig()

  const activeStyle =
    isActive && themeColor
      ? {
          borderBottomColor: themeColor,
        }
      : undefined

  return (
    <button
      type="button"
      onClick={onClick}
      className={classNames(
        'relative px-3 py-3 text-sm sm:px-6',
        'border-b-4 border-l-0 border-r-0 border-t-0 border-solid',
        'rounded-t bg-gray-200',
        'transition-colors duration-200',
        'outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'cursor-pointer active:scale-[0.98]',
        'flex-shrink-0 whitespace-nowrap',
        isActive
          ? themeColor
            ? '-mb-0.5 border-current font-medium text-gray-900'
            : '-mb-0.5 border-blue-600 font-medium text-gray-900'
          : 'border-transparent font-normal text-gray-500 hover:bg-gray-100 hover:text-gray-400',
      )}
      style={activeStyle}
    >
      {label}
    </button>
  )
}

const Tabs = ({ value, onChange, children, className }: TabsProps) => {
  return (
    <div className={classNames('border-b-2 border-l-0 border-r-0 border-t-0 border-solid border-gray-200', className)}>
      <nav className="-mx-1 flex flex-nowrap gap-1 overflow-x-auto overflow-y-hidden scroll-smooth px-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {React.Children.map(children, child => {
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
