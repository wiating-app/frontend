import React from 'react'
import { Paper, MenuList, MenuItem } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import texts from '../utils/texts'


const ContextMenu = ({ addMarker }) => {
  const classes = useStyles()
  return (
    <Paper className={classes.root}>
      <MenuList>
        <MenuItem
          onClick={addMarker}
        >{texts.map.add}</MenuItem>
      </MenuList>
    </Paper>
  )
}

const useStyles = makeStyles({
  root: {
    zIndex: 99,
  },
})

export default ContextMenu
