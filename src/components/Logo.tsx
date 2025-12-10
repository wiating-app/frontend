import React from 'react'
import classNames from 'classnames'
import { Link } from 'react-router-dom'
import useConfig from '../utils/useConfig'

interface LogoProps {
  className?: string
}

const Logo = ({ className }: LogoProps) => {
  const { branding } = useConfig()

  return (
    <Link to="/" className={classNames('flex items-center', className)}>
      <img
        src={`${process.env.CUSTOMIZATION_URL}/purelogo.png`}
        srcSet={`${process.env.CUSTOMIZATION_URL}/purelogo@2x.png 2x`}
        alt={branding.siteName}
      />
      <img
        src={`${process.env.CUSTOMIZATION_URL}/logotype.png`}
        srcSet={`${process.env.CUSTOMIZATION_URL}/logotype@2x.png 2x`}
        className="ml-2 hidden sm:block"
        alt=""
      />
    </Link>
  )
}

export default Logo
