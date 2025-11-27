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
        'flex items-center justify-center w-10 h-10 rounded-full bg-gray-300 text-gray-700 text-sm font-medium overflow-hidden',
        className
      )}
      role="img"
      aria-label={alt}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="select-none">{children}</span>
      )}
    </div>
  )
}

export default Avatar

