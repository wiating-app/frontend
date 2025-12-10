import React from 'react'
import classNames from 'classnames'
import ReactLoading from 'react-loading'

interface LoaderProps {
  dark?: boolean
  big?: boolean
  centered?: boolean
}

const Loader = ({ dark, big, centered }: LoaderProps) => {
  const loader = (
    <ReactLoading
      type="spinningBubbles"
      width={big ? 80 : 18}
      height={big ? 80 : 18}
      className={classNames('[&_svg]:fill-current', dark ? 'text-gray-400' : 'text-white')}
    />
  )

  if (centered) {
    return <div className="flex h-full w-full items-center justify-center">{loader}</div>
  }

  return loader
}

export default Loader
