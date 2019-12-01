import React from 'react'
import { Paper, MenuList, MenuItem } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Text from './Text'


const ContextMenu = ({ addMarker }) => {
  const classes = useStyles()
  return (
    <Paper className={classes.root}>
      <MenuList>
        <MenuItem
          onClick={addMarker}
        ><Text id='map.add' /></MenuItem>
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
