import React from 'react'
import { Paper, MenuList, MenuItem } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { strings } from '../lang/strings.js'


const ContextMenu = ({ addMarker }) => {
  const classes = useStyles()
  return (
    <Paper className={classes.root}>
      <MenuList>
        <MenuItem
          onClick={addMarker}
        >{strings.map.add}</MenuItem>
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
