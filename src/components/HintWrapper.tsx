import React from 'react'
import { Tooltip } from './Tooltip'
import { Info } from 'lucide-react'

interface HintWrapperProps {
  message: string
  children: React.ReactNode
}

const HintWrapper = ({ message, children }: HintWrapperProps) => {
  return (
    <div className="flex justify-between gap-2">
      <div className="flex-1">{children}</div>
      <div className="pt-8">
        <Tooltip
          content={message}
          anchor="right-center"
          mobileAnchor="left-center"
          delay={200}
          tooltipClassName="cursor-help text-gray-400 hover:text-gray-500"
        >
          <Info size={24} />
        </Tooltip>
      </div>
    </div>
  )
}

export default HintWrapper
