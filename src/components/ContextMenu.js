import React from 'react'
import { Paper, MenuList, MenuItem } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import useLanguage from '../utils/useLanguage'


const ContextMenu = ({ addMarker }) => {
  const classes = useStyles()
  const { translations } = useLanguage()
  return (
    <Paper className={classes.root}>
      <MenuList>
        <MenuItem
          onClick={addMarker}
        >{translations.addMarkerHere}</MenuItem>
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
