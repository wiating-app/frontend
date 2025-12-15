import React from 'react'
import classNames from 'classnames'
import ReactLoading from 'react-loading'

interface LoaderProps {
  light?: boolean
  big?: boolean
  fullscreen?: boolean
}

const Loader = ({ light, big, fullscreen }: LoaderProps) => {
  return (
    <div
      className={classNames(
        'flex items-center justify-center',
        fullscreen ? 'h-screen w-full' : 'h-full w-full',
        light ? 'text-white' : 'text-gray-400',
      )}
    >
      <ReactLoading
        type="spinningBubbles"
        width={big ? 80 : 18}
        height={big ? 80 : 18}
        className="[&_svg]:fill-current"
      />
    </div>
  )
}

export default Loader
