import React from 'react'
import { Tooltip } from './Tooltip'
import { InfoOutlined } from '@material-ui/icons'


interface HintWrapperProps {
  message: string
  children: React.ReactNode
}

const HintWrapper = ({ message, children }: HintWrapperProps) => {
  return (
    <div className="flex justify-between">
      <div className="flex-[11]">
        {children}
      </div>
      <div className="flex-1 pt-2">
        <Tooltip content={message} anchor="right-center" delay={0} tooltipClassName="cursor-help">
          <InfoOutlined />
        </Tooltip>
      </div>
    </div>
  )
}

export default HintWrapper
