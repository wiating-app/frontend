import React from 'react'
import { Download } from 'lucide-react'
import { Location } from '../typings'
import exportToGPX from '../utils/exportToGPX'
import exportToKML from '../utils/exportToKML'
import useConfig from '../utils/useConfig'
import Menu from './Menu'
import { Tooltip } from './Tooltip'

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
    <Tooltip content="Eksport lokacji z wyświetlanego obszaru" anchor="left-center">
      <div className="relative">
        <a className={className} onClick={handleClick}>
          <Download size={16} strokeWidth={2.5} />
        </a>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={handleClose} />
            <div className="absolute right-0 top-full z-20 mt-1">
              <Menu items={items} onClose={handleClose} className="min-w-[200px]" />
            </div>
          </>
        )}
      </div>
    </Tooltip>
  )
}

export default Export
