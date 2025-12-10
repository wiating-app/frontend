import React from 'react'
import { Tooltip } from './Tooltip'
import { ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'

interface OpenInNewCardProps {
  path: string
  children: React.ReactNode
  component?: React.ElementType
  [key: string]: any
}

const OpenInNewCard = ({ path, children, component, ...otherProps }: OpenInNewCardProps) => {
  return (
    <Tooltip content="Przejdź do lokacji">
      <Link
        to={path}
        component={component}
        target="_blank"
        className={
          !component
            ? 'group cursor-pointer font-semibold text-gray-700 no-underline hover:text-gray-800 hover:underline'
            : ''
        }
        {...otherProps}
      >
        {children}{' '}
        <ExternalLink className="ml-1 inline text-gray-400 group-hover:text-gray-800" size={12} strokeWidth={2.5} />
      </Link>
    </Tooltip>
  )
}

export default OpenInNewCard
