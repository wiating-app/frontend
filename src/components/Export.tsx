import React from 'react'
import { Menu, Tooltip, MenuItem } from '@material-ui/core'
import { GetApp } from '@material-ui/icons'
import exportToKML from '../utils/exportToKML'
import exportToGPX from '../utils/exportToGPX'
import useConfig from '../utils/useConfig'
import { Location } from '../typings'


interface ExportProps {
  markers: Location[]
  className?: string
}

const Export = ({ markers, className }: ExportProps) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const config = useConfig()
  const items = [
    {
      label: 'Pobierz plik KML',
      callback: () => exportToKML(markers, config),
    },
    {
      label: 'Pobierz plik GPX',
      callback: () => exportToGPX(markers),
    },
  ]

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  if (!config.settings.enableExport) return null

  return (
    <Tooltip title='Eksport lokacji z wyświetlanego obszaru' placement='left'>
      <div>
        <a
          aria-controls='simple-menu'
          color='inherit'
          aria-haspopup='true'
          className={className}
          onClick={handleClick}
        ><GetApp style={{ fontSize: 20 }} /></a>
        <Menu
          id='simple-menu'
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
          getContentAnchorEl={null}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          {items.map((item, index) =>
            <MenuItem key={index} onClick={() => {
              item.callback()
              handleClose()
            }}>{item.label}</MenuItem>
          )}
        </Menu>
      </div>
    </Tooltip>
  )
}

export default Export
