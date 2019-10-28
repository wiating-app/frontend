import React from 'react'
import { Paper, MenuList, MenuItem } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { strings } from '../lang/strings.js'


const ContextMenu = ({ position, addMarker }) => {
  const { x = 0, y = 0 } = position
  const classes = useStyles(position)
  return (
    <Paper className={classes.root}>
      <MenuList>
        <MenuItem
          onClick={() => addMarker(x, y)}
        >{strings.map.add}</MenuItem>
      </MenuList>
    </Paper>
  )
}

const useStyles = makeStyles({
  root: {
    position: 'absolute',
    zIndex: 99,
    left: position => position.x,
    top: position => position.y,
  },
})

export default ContextMenu
