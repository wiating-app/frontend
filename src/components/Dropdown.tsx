import React from 'react'
import classNames from 'classnames'
import Menu, { MenuItem } from './Menu'

interface DropdownProps {
  children: React.ReactNode
  items: MenuItem[]
  anchorOrigin?: {
    vertical: 'top' | 'bottom'
    horizontal: 'left' | 'center' | 'right'
  }
}

const Dropdown = ({ children, items, anchorOrigin }: DropdownProps) => {
  const [isOpen, setIsOpen] = React.useState(false)

  const handleClick = () => {
    setIsOpen(!isOpen)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  const defaultAnchorOrigin = {
    vertical: 'bottom' as const,
    horizontal: 'right' as const,
  }

  const origin = anchorOrigin || defaultAnchorOrigin

  const getMenuPositionClasses = () => {
    const vertical = origin.vertical === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'
    const horizontal =
      origin.horizontal === 'left' ? 'left-0' : origin.horizontal === 'center' ? 'left-1/2 -translate-x-1/2' : 'right-0'
    return `${vertical} ${horizontal}`
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleClick}
        className="flex cursor-pointer items-center border-none bg-transparent p-0 text-inherit"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {children}
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={handleClose} />
          <div className={classNames('absolute z-50 w-auto border border-gray-200', getMenuPositionClasses())}>
            <Menu items={items} onClose={handleClose} className="whitespace-nowrap" />
          </div>
        </>
      )}
    </div>
  )
}

export default Dropdown
