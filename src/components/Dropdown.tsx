import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Menu, MenuItem } from '@material-ui/core'

interface DropdownItem {
  label: React.ReactNode
  url?: string
  callback?: () => void
  divider?: boolean
}

interface DropdownProps {
  children: React.ReactNode
  items: DropdownItem[]
  anchorOrigin?: {
    vertical: 'top' | 'bottom'
    horizontal: 'left' | 'center' | 'right'
  }
}

const Dropdown = ({ children, items, anchorOrigin }: DropdownProps) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const defaultAnchorOrigin = {
    vertical: 'bottom' as const,
    horizontal: 'right' as const,
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
        anchorOrigin={anchorOrigin || defaultAnchorOrigin}
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
            item.callback?.()
            handleClose()
          }}>{item.label}</MenuItem>
        )}
      </Menu>
    </div>
  )
}

export default Dropdown

