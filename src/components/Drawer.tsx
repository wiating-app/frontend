import React from 'react'
import classNames from 'classnames'
import { X } from 'lucide-react'
import PerfectScrollbar from 'react-perfect-scrollbar'
import 'react-perfect-scrollbar/dist/css/styles.css'
import { useHistory, useLocation } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { isDrawerOpenState } from '../state'
import useKeyPress from '../utils/useKeyPress'
import useMediaQuery from '../utils/useMediaQuery'
import IconButton from './IconButton'

interface DrawerProps {
  children: React.ReactNode
}

export const DRAWER_WIDTH = 400
const MOBILE_MINI_MAP_HEIGHT = 200

const Drawer: React.FC<DrawerProps> = ({ children }) => {
  const history = useHistory()
  const location = useLocation()
  const { pathname } = location
  const coverMinimapOnMobile = pathname.startsWith('/search')
  const { isPhone } = useMediaQuery()
  const [isDrawerOpen] = useRecoilState(isDrawerOpenState)

  const handleOnClose = () => history.push('/')

  useKeyPress('Escape', () => {
    handleOnClose()
  })

  const mobileHeight = coverMinimapOnMobile ? '100dvh' : `calc(100dvh - ${MOBILE_MINI_MAP_HEIGHT}px)`

  return (
    <div
      className={classNames(
        'fixed bottom-0 z-[1200] flex-shrink-0 bg-white transition-transform duration-300 ease-in-out',
        isPhone ? 'left-0 right-0 shadow-[0_-4px_8px_-2px_rgba(0,0,0,0.15)]' : 'left-0 top-16 shadow-2xl',
      )}
      style={{
        ...(isPhone
          ? {
              height: mobileHeight,
              transform: isDrawerOpen ? 'translateY(0)' : 'translateY(100%)',
            }
          : {
              width: `${DRAWER_WIDTH}px`,
              transform: isDrawerOpen ? 'translateX(0)' : 'translateX(-100%)',
            }),
      }}
    >
      {/* Scrollable content */}
      <PerfectScrollbar
        options={{
          suppressScrollX: true,
        }}
        className="flex min-h-full flex-col"
      >
        <IconButton
          size="small"
          className="bg-white/67 absolute right-2 top-2 z-[1000] hover:bg-white/90"
          aria-label="close"
          onClick={() => history.push('/')}
        >
          <X size={24} />
        </IconButton>
        {children}
      </PerfectScrollbar>
    </div>
  )
}

export default Drawer
