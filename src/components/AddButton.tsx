import React from 'react'
import { MapPinPlus } from 'lucide-react'
import useConfig from '../utils/useConfig'
import useLanguage from '../utils/useLanguage'
import Menu, { MenuItem } from './Menu'
import { Tooltip } from './Tooltip'
import Typography from './Typography'

interface AddButtonProps {
  items: MenuItem[]
}

const AddButton = ({ items }: AddButtonProps) => {
  const { translations } = useLanguage()
  const {
    branding: { themeColor },
  } = useConfig()
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
    <div className="fixed bottom-20 right-2 z-[1050]">
      <Tooltip content={translations.addMarker} anchor="left-center">
        <button
          className="flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition-shadow hover:shadow-xl"
          style={{ backgroundColor: themeColor }}
          aria-label="Add"
          onClick={handleOpen}
          aria-owns={isOpen ? 'plus-menu' : undefined}
          aria-haspopup="true"
        >
          <MapPinPlus size={24} />
        </button>
      </Tooltip>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-[1100]" onClick={() => setIsOpen(null)} />
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
              header={<Typography variant="subtitle2">{translations.addMarker}</Typography>}
              className="min-w-[240px]"
            />
          </div>
        </>
      )}
    </div>
  )
}

export default AddButton
