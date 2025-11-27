import React, { FC, MouseEvent, PropsWithChildren, ReactNode, useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import classNames from 'classnames'

type TooltipProps = {
  content?: ReactNode
  className?: string
  position?: 'above' | 'below'
  delay?: number
  tooltipClassName?: string
}

export const Tooltip: FC<PropsWithChildren<TooltipProps>> = ({
  content,
  children,
  className,
  position = 'above',
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
    const tooltipTop =
      position === 'above'
        ? rect.top - 8
        : rect.bottom + 8

    // Anchor to left
    const tooltipLeft = rect.left

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
