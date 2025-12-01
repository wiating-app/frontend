import React, { FC, MouseEvent, PropsWithChildren, ReactNode, useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import classNames from 'classnames'

type TooltipProps = {
  content?: ReactNode
  className?: string
  anchor?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right' | 'left-center' | 'right-center'
  delay?: number
  tooltipClassName?: string
}

export const Tooltip: FC<PropsWithChildren<TooltipProps>> = ({
  content,
  children,
  className,
  anchor = 'top-center',
  delay = 750,
  tooltipClassName = 'inline-block',
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const triggerRef = useRef<HTMLSpanElement>(null)

  const showTooltip = (e: MouseEvent<HTMLElement>) => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    const rect = e.currentTarget.getBoundingClientRect()
    let tooltipTop = 0
    let tooltipLeft = 0

    switch (anchor) {
      case 'top-left':
        tooltipTop = rect.top - 8
        tooltipLeft = rect.left
        break
      case 'top-center':
        tooltipTop = rect.top - 8
        tooltipLeft = rect.left + rect.width / 2
        break
      case 'top-right':
        tooltipTop = rect.top - 8
        tooltipLeft = rect.right
        break
      case 'bottom-left':
        tooltipTop = rect.bottom + 8
        tooltipLeft = rect.left
        break
      case 'bottom-center':
        tooltipTop = rect.bottom + 8
        tooltipLeft = rect.left + rect.width / 2
        break
      case 'bottom-right':
        tooltipTop = rect.bottom + 8
        tooltipLeft = rect.right
        break
      case 'left-center':
        tooltipTop = rect.top + rect.height / 2
        tooltipLeft = rect.left - 8
        break
      case 'right-center':
        tooltipTop = rect.top + rect.height / 2
        tooltipLeft = rect.right + 8
        break
    }

    setTooltipPosition({
      top: tooltipTop,
      left: tooltipLeft,
    })

    timeoutRef.current = setTimeout(() => {
      setIsVisible(true)
    }, delay)
  }

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setIsVisible(false)
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const getTransform = () => {
    switch (anchor) {
      case 'top-left':
        return 'translate(0, -100%)'
      case 'top-center':
        return 'translate(-50%, -100%)'
      case 'top-right':
        return 'translate(-100%, -100%)'
      case 'bottom-left':
        return 'translate(0, 0)'
      case 'bottom-center':
        return 'translate(-50%, 0)'
      case 'bottom-right':
        return 'translate(-100%, 0)'
      case 'left-center':
        return 'translate(-100%, -50%)'
      case 'right-center':
        return 'translate(0, -50%)'
      default:
        return 'translate(-50%, -100%)'
    }
  }

  const tooltipElement = isVisible && content
    ? (
        <div
          className={classNames(
            'pointer-events-none fixed z-[10000] max-w-[50%] overflow-hidden whitespace-normal break-words rounded px-2 py-1 text-sm shadow-md bg-gray-500 text-white',
            className
          )}
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
            transform: getTransform(),
          }}
        >
          {content}
        </div>
      )
    : null

  return (
    <>
      <span
        ref={triggerRef}
        className={tooltipClassName}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
      >
        {children}
      </span>
      {createPortal(tooltipElement, document.body)}
    </>
  )
}
