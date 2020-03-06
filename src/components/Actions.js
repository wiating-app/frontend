import React from 'react'
import {
  Button,
  ButtonGroup,
  Popper,
  Grow,
  Paper,
  ClickAwayListener,
  MenuList,
  MenuItem,
} from '@material-ui/core'
import { MoreHoriz } from '@material-ui/icons'


const Actions = ({ primary, secondary }) => {
  const [open, setOpen] = React.useState(false)
  const anchorRef = React.useRef(null)

  const handleClose = event => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return
    }
    setOpen(false)
  }

  return (
    <>
      <ButtonGroup
        size='small'
        color='primary'
        variant='contained'
        ref={anchorRef}
      >
        {primary && primary.map((item, index) =>
          <Button key={index} onClick={() => item.action()} >{item.label}</Button>
        )}
        {secondary &&
          <Button onClick={() => setOpen(prevOpen => !prevOpen)}>
            <MoreHoriz />
          </Button>
        }
      </ButtonGroup>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        style={{ zIndex: 1 }}
      >
        {({ TransitionProps, placement }) =>
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id='split-button-menu'>
                  {secondary.map((item, index) => (
                    <MenuItem
                      key={index}
                      onClick={() => {
                        setOpen(false)
                        item.action()
                      }}
                    >{item.label}</MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        }
      </Popper>
    </>
  )
}

export default Actions
