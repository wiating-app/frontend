import React from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames'

interface DropdownItem {
  label: React.ReactNode
  url?: string
  callback?: () => void
  divider?: boolean
}

interface DropdownProps {
  children: React.ReactNode
  items: DropdownItem[]
  anchorOrigin?: {
    vertical: 'top' | 'bottom'
    horizontal: 'left' | 'center' | 'right'
  }
}

const Dropdown = ({ children, items, anchorOrigin }: DropdownProps) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  const handleClick = () => {
    setIsOpen(!isOpen)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  React.useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        handleClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const defaultAnchorOrigin = {
    vertical: 'bottom' as const,
    horizontal: 'right' as const,
  }

  const origin = anchorOrigin || defaultAnchorOrigin

  const getMenuPositionClasses = () => {
    const vertical = origin.vertical === 'top'
      ? 'bottom-full mb-1'
      : 'top-full mt-1'
    const horizontal =
      origin.horizontal === 'left'
        ? 'left-0'
        : origin.horizontal === 'center'
          ? 'left-1/2 -translate-x-1/2'
          : 'right-0'
    return `${vertical} ${horizontal}`
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={handleClick}
        className="flex items-center bg-transparent border-none cursor-pointer p-0 text-inherit"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {children}
      </button>
      {isOpen && (
        <div
          className={classNames(
            'absolute z-50 min-w-[160px] w-auto bg-white rounded-md shadow-lg py-1 border border-gray-200',
            getMenuPositionClasses()
          )}
          role="menu"
          aria-orientation="vertical"
        >
          {items.map((item, index) => {
            const showDivider = item.divider && index > 0
            const itemClasses = 'block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer no-underline whitespace-nowrap'

            return (
              <React.Fragment key={index}>
                {showDivider && <div className="bg-gray-200 h-px" />}
                {item.url
                  ? (
                      <Link
                        to={item.url}
                        className={itemClasses}
                        onClick={handleClose}
                      >
                        {item.label}
                      </Link>
                    )
                  : (
                      <div
                        className={itemClasses}
                        onClick={() => {
                          item.callback?.()
                          handleClose()
                        }}
                      >
                        {item.label}
                      </div>
                    )}
              </React.Fragment>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Dropdown
