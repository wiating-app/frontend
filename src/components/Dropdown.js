import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Menu, MenuItem } from '@material-ui/core'

const Dropdown = ({ children, items, anchorOrigin }) => {
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
        anchorOrigin={anchorOrigin}
      >
        {items.map((item, index) => item.url
          ? <MenuItem
            component={Link}
            to={item.url}
            key={index}
            onClick={() => handleClose()}
            divider={item.divider}
          >{item.label}</MenuItem>
          : <MenuItem key={index} divider={item.divider} onClick={() => {
            item.callback()
            handleClose()
          }}>{item.label}</MenuItem>
        )}
      </Menu>
    </div>
  )
}

Dropdown.defaultProps = {
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'right',
  },
}

export default Dropdown
