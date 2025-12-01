import React from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames'

export interface MenuItem {
  label: React.ReactNode
  icon?: React.ReactNode
  url?: string
  callback?: () => void
  divider?: boolean
  disabled?: boolean
}

interface MenuProps {
  items: MenuItem[]
  onClose?: () => void
  className?: string
  header?: React.ReactNode
}

const Menu = ({ items, onClose, className, header }: MenuProps) => {
  const itemClasses = 'block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer no-underline'

  return (
    <div
      className={classNames(
        'bg-white rounded shadow-lg py-2 min-w-[160px]',
        className
      )}
      role="menu"
      aria-orientation="vertical"
    >
      {header && (
        <div className="px-4 py-2 pointer-events-none border-b border-gray-200 mb-1">
          {header}
        </div>
      )}
      {items.map((item, index) => {
        const showDivider = item.divider && index > 0
        const classes = classNames(
          itemClasses,
          item.icon && 'flex items-center gap-3',
          item.disabled && 'opacity-50 cursor-not-allowed pointer-events-none'
        )

        return (
          <React.Fragment key={index}>
            {showDivider && <div className="bg-gray-200 h-px my-1" />}
            {item.url
              ? (
                  <Link
                    to={item.url}
                    className={classes}
                    onClick={() => onClose?.()}
                  >
                    {item.icon && <div className="min-w-[24px] flex items-center justify-center">{item.icon}</div>}
                    {item.label}
                  </Link>
                )
              : (
                  <div
                    className={classes}
                    onClick={() => {
                      if (!item.disabled) {
                        item.callback?.()
                        onClose?.()
                      }
                    }}
                  >
                    {item.icon && <div className="min-w-[24px] flex items-center justify-center">{item.icon}</div>}
                    {item.label}
                  </div>
                )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

export default Menu
