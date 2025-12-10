import React, { useEffect, useState } from 'react'
import history from '../history'
import useKeyPress from '../utils/useKeyPress'
import IconButton from './IconButton'
import classNames from 'classnames'
import { X } from 'lucide-react'
import PerfectScrollbar from 'react-perfect-scrollbar'

interface ModalProps {
  wide?: boolean
  short?: boolean
  small?: boolean
  children: React.ReactNode
  onClose?: () => void
  id?: string
}

const Modal = ({ wide, short, small, children, onClose, id }: ModalProps) => {
  const [isVisible, setIsVisible] = useState(false)

  const handleOnClose = () => {
    onClose ? onClose() : history.goBack()
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only close if clicking the backdrop itself, not the content
    if (e.target === e.currentTarget) {
      handleOnClose()
    }
  }

  useKeyPress('Escape', () => {
    handleOnClose()
  })

  // Prevent body scroll when modal is open
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = originalStyle
    }
  }, [])

  // Trigger slide-in animation on mount
  useEffect(() => {
    // Small delay to trigger animation after render
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 10)
    return () => clearTimeout(timer)
  }, [])

  // Determine width classes
  const widthClass = wide ? 'w-[1200px]' : small ? 'w-[320px]' : 'w-[800px]'

  // Determine max height for small variant
  const maxHeightClass = small ? 'max-h-[160px]' : ''

  // Determine margin classes for short variant (on screens >= 900px)
  const marginClass = short ? 'min-[900px]:my-[30px]' : ''

  // Disable flex-grow for short modals to prevent min-height
  const flexGrowClass = short ? '' : 'flex-grow'

  return (
    <div
      className="fixed inset-0 z-[1300] flex flex-col items-center justify-center bg-black/50"
      onClick={handleBackdropClick}
      id={id}
    >
      {/* Toolbar spacing for md+ screens (64px height) */}
      <div className="hidden h-16 flex-shrink-0 md:block" />

      <div
        className={classNames(
          'relative box-border max-w-full overflow-hidden rounded-md bg-gray-50',
          'transition-all duration-300 ease-out focus:outline-none',
          flexGrowClass,
          widthClass,
          maxHeightClass,
          marginClass,
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0',
        )}
        onClick={e => e.stopPropagation()}
      >
        <PerfectScrollbar className="px-4 py-8 sm:px-10">{children}</PerfectScrollbar>
        <IconButton className="absolute right-3 top-3" onClick={handleOnClose}>
          <X size={24} />
        </IconButton>
      </div>
    </div>
  )
}

export default Modal
