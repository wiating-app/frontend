import React from 'react'
import { Tooltip } from '@material-ui/core'
import { Info } from '@material-ui/icons'

const Hint = ({ message }) => {
  return (
    <Tooltip title={message}>
      <Info style={{ cursor: 'help' }} />
    </Tooltip>
  )
}

export default Hint
