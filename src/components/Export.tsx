import React from 'react'
import Menu from './Menu'
import { Tooltip } from './Tooltip'
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
  const [isOpen, setIsOpen] = React.useState(false)
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

  const handleClick = () => {
    setIsOpen(!isOpen)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  if (!config.settings.enableExport) return null

  return (
    <Tooltip content='Eksport lokacji z wyświetlanego obszaru' anchor='left-center'>
      <div className="relative">
        <a
          aria-controls='export-menu'
          aria-haspopup='true'
          className={className}
          onClick={handleClick}
        ><GetApp style={{ fontSize: 20 }} /></a>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={handleClose} />
            <div className="absolute top-full left-0 mt-1 z-20">
              <Menu
                items={items}
                onClose={handleClose}
                className="min-w-[200px]"
              />
            </div>
          </>
        )}
      </div>
    </Tooltip>
  )
}

export default Export
