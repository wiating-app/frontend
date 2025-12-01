import React from 'react'
import { Link } from 'react-router-dom'
import { Tooltip } from './Tooltip'
import { OpenInNew } from '@material-ui/icons'

interface OpenInNewCardProps {
  path: string
  children: React.ReactNode
  component?: React.ElementType
  [key: string]: any
}

const OpenInNewCard = ({ path, children, component, ...otherProps }: OpenInNewCardProps) => {
  return (
    <Tooltip content='Przejdź do lokacji'>
      <Link
        to={path}
        component={component}
        target='_blank'
        className={!component ? 'cursor-pointer font-bold text-gray-900 no-underline hover:underline' : ''}
        {...otherProps}
      >{children} <OpenInNew className="text-xs ml-1" />
      </Link>
    </Tooltip>
  )
}

export default OpenInNewCard
