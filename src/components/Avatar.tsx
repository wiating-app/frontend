import React from 'react'
import classNames from 'classnames'

interface AvatarProps {
  alt?: string
  src?: string
  children?: React.ReactNode
  className?: string
}

const Avatar = ({ alt, src, children, className }: AvatarProps) => {
  return (
    <div
      className={classNames(
        'flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gray-300 text-sm font-medium text-gray-700',
        className,
      )}
      role="img"
      aria-label={alt}
    >
      {src ? (
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      ) : (
        <span className="select-none">{children}</span>
      )}
    </div>
  )
}

export default Avatar
