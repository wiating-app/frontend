import React from 'react'
import Typography from './Typography'
import Menu, { MenuItem } from './Menu'
import { Tooltip } from './Tooltip'
import { Fade } from '@material-ui/core'
import { AddLocation } from '@material-ui/icons'
import useLanguage from '../utils/useLanguage'
import useConfig from '../utils/useConfig'

interface AddButtonProps {
  items: MenuItem[]
  isLoggedIn: boolean
}

const AddButton = ({ items, isLoggedIn }: AddButtonProps) => {
  const { translations } = useLanguage()
  const { branding: { themeColor } } = useConfig()
  const [isOpen, setIsOpen] = React.useState<null | HTMLElement>(null)
  const [menuPosition, setMenuPosition] = React.useState({ top: 0, left: 0 })

  const handleOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMenuPosition({
      top: rect.top - 8, // 8px gap above button
      left: rect.left - 200, // menu width approx
    })
    setIsOpen(e.currentTarget)
  }

  return (
    isLoggedIn
      ? <div className="fixed right-2 bottom-20 z-[1050]">
        <Tooltip content={translations.addMarker}>
          <button
            className="w-14 h-14 rounded-full shadow-lg text-white flex items-center justify-center hover:shadow-xl transition-shadow"
            style={{ backgroundColor: themeColor }}
            aria-label='Add'
            onClick={handleOpen}
            aria-owns={isOpen ? 'plus-menu' : undefined}
            aria-haspopup='true'
          ><AddLocation /></button>
        </Tooltip>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-[1100]" onClick={() => setIsOpen(null)} />
            <Fade in={Boolean(isOpen)}>
              <div
                className="fixed z-[1200]"
                style={{
                  top: menuPosition.top,
                  left: menuPosition.left,
                  transform: 'translateY(-100%)',
                }}
              >
                <Menu
                  items={items}
                  onClose={() => setIsOpen(null)}
                  header={<Typography variant='subtitle2'>{translations.addMarker}</Typography>}
                  className="min-w-[240px]"
                />
              </div>
            </Fade>
          </>
        )}
      </div>
      : null
  )
}

export default AddButton
