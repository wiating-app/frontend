import React from 'react'
import { Button, Menu, MenuItem } from '@material-ui/core'

const Dropdown = ({ children, items }) => {
  const [anchorEl, setAnchorEl] = React.useState(null)

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <div>
      <Button
        aria-controls='simple-menu'
        color='inherit'
        aria-haspopup='true'
        onClick={handleClick}
      >{children}</Button>
      <Menu
        id='simple-menu'
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        {items.map((item, index) =>
          <MenuItem key={index} onClick={() => {
            item.onClick()
            handleClose()
          }}>{item.label}</MenuItem>
        )}
      </Menu>
    </div>
  )
}

export default Dropdown
