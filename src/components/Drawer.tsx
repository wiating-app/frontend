import { X } from 'lucide-react'
import React from 'react'
import { isDrawerOpenState } from '../state'
import useKeyPress from '../utils/useKeyPress'
import useMediaQuery from '../utils/useMediaQuery'
import { useRecoilState } from 'recoil'
import { useHistory, useLocation } from 'react-router-dom'
import IconButton from './IconButton'
import classNames from 'classnames'
import PerfectScrollbar from 'react-perfect-scrollbar'
import 'react-perfect-scrollbar/dist/css/styles.css'

interface DrawerProps {
  children: React.ReactNode
}

export const DRAWER_WIDTH = 400
const MOBILE_MINI_MAP_HEIGHT = 200

const Drawer: React.FC<DrawerProps> = ({
  children,
}) => {
  const history = useHistory()
  const location = useLocation()
  const { pathname } = location
  const coverMapOnMobile = pathname.startsWith('/search')
  const isNotSmartphone = useMediaQuery('(min-width: 600px)')
  const [isDrawerOpen] = useRecoilState(isDrawerOpenState)

  const handleOnClose = () => history.push('/')

  useKeyPress('Escape', () => {
    handleOnClose()
  })

  const mobileHeight = coverMapOnMobile
    ? '100vh'
    : `calc(100vh - ${MOBILE_MINI_MAP_HEIGHT}px)`

  return (
    <div
      className={classNames(
        'fixed z-[1200] bg-white flex-shrink-0 transition-transform duration-300 ease-in-out shadow-2xl bottom-0',
        isNotSmartphone ? 'top-16 left-0' : 'left-0 right-0',
      )}
      style={{
        ...(isNotSmartphone
          ? {
              width: `${DRAWER_WIDTH}px`,
              transform: isDrawerOpen ? 'translateX(0)' : 'translateX(-100%)',
            }
          : {
              height: mobileHeight,
              transform: isDrawerOpen ? 'translateY(0)' : 'translateY(100%)',
            }),
      }}
    >

      {/* Scrollable content */}
      <PerfectScrollbar
        options={{
          suppressScrollX: true,
        }}
        className="flex flex-col min-h-full"
      >
        <IconButton
          size='small'
          className="absolute top-2 right-2 z-[1000] bg-white/67 hover:bg-white/90"
          aria-label='close'
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
