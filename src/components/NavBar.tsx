import React from 'react'
import { ArrowDropDown, Menu } from '@material-ui/icons'
import Form from '@react-form-component/mui'
import classNames from 'classnames'
import { useRecoilState } from 'recoil'
import Dropdown from './Dropdown'
import Avatar from './Avatar'
import Button from './Button'
import Logo from './Logo'
import SearchInput from './SearchInput'
import Loader from './Loader'
import Version from './Version'
import useLanguage from '../utils/useLanguage'
import useConfig from '../utils/useConfig'
import { isDrawerOpenState } from '../state'


interface NavBarLink {
  label: React.ReactNode
  url?: string
  callback?: () => void
  divider?: boolean
}

interface NavBarProps {
  user?: {
    name?: string
    picture?: string
    given_name?: string
    family_name?: string
    [key: string]: any
  }
  links: NavBarLink[]
  isLoggedIn: boolean
  onSearch: (phrase: string) => void
  searchLoading: boolean
  authLoading: boolean
  language: string
  languages: string[]
  setLanguage: (lang: string) => void
}

const NavBar = ({
  user,
  links,
  isLoggedIn,
  onSearch,
  searchLoading,
  authLoading,
  language,
  languages,
  setLanguage,
}: NavBarProps) => {
  const [isDrawerOpen] = useRecoilState(isDrawerOpenState)
  const { translations } = useLanguage()
  const { branding: { themeColor, lightTheme }, settings: { showVersionInfo } } = useConfig()

  return (
    <div
      className={classNames(
        'relative z-[1201] shadow',
        {
          'hidden md:block': isDrawerOpen,
        }
      )}
      style={{ backgroundColor: lightTheme ? 'transparent' : themeColor || undefined }}
      id='cy-navbar'
    >
      <div className="flex items-center min-h-[64px] px-4">
        <Logo className="mr-4 hidden lg:flex" />
        <Form
          fields={['phrase']}
          onChange={(fields: any) => onSearch(fields.phrase)}
          runOnChangeInitially
          className="w-[202px] md:w-auto"
        >
          <SearchInput
            name='phrase'
            placeholder={translations.search}
            size='small'
            loading={searchLoading}
          />
        </Form>
        <div className="flex-1 ml-2 opacity-30">
          {showVersionInfo && <div className="hidden lg:block"><Version /></div>}
        </div>
        <div className="flex gap-4 items-center text-white">
          <Button
            variant='default'
            className="hidden sm:block"
            href='https://patronite.pl/Wiating.eu'
            size='medium'
            target='_blank'
            rel='noopener noreferrer'
          >Wesprzyj nas</Button>
          {!authLoading && !isLoggedIn &&
            <Dropdown
              items={languages.map(lang => ({
                label: lang.toUpperCase(),
                callback: () => setLanguage(lang),
              }))}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
            >{language ? language.toUpperCase() : ''}</Dropdown>
          }
          {authLoading
            ? <Loader />
            : <Dropdown items={links}>
              {isLoggedIn
                ? <div className="flex items-center">
                  <Avatar alt={user?.name} src={user?.picture}>
                    {!user?.picture && `${user?.given_name?.charAt(0) || ''}${user?.family_name?.charAt(0) || ''}`}
                  </Avatar>
                  <span className="ml-2 normal-case text-white text-md whitespace-nowrap hidden md:inline">{user?.name && user.name}</span>
                  <ArrowDropDown className="text-white" />
                </div>
                : <Menu className="text-white" />
              }
            </Dropdown>
          }
        </div>
      </div>
    </div>
  )
}

export default NavBar
