import React from 'react'
import { Grid } from '@material-ui/core'
import InfoTooltip from './InfoTooltip'


const HintWrapper = ({ message, children }) => {
  return (
    <Grid container justify='space-between'>
      <Grid item xs={11}>
        {children}
      </Grid>
      <Grid item xs={1}>
        <div>
          <InfoTooltip large placement='left-start'>{message}</InfoTooltip>
        </div>
      </Grid>
    </Grid>
  )
}

export default HintWrapper
