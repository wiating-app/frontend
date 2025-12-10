import React from 'react'
import { isDrawerOpenState } from '../state'
import useConfig from '../utils/useConfig'
import useLanguage from '../utils/useLanguage'
import Avatar from './Avatar'
import Button from './Button'
import Dropdown from './Dropdown'
import Loader from './Loader'
import Logo from './Logo'
import SearchInput from './SearchInput'
import Version from './Version'
import classNames from 'classnames'
import { ChevronDown, Menu } from 'lucide-react'
import Form from 'react-form-component'
import { useRecoilState } from 'recoil'

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
  const {
    branding: { themeColor, lightTheme },
    settings: { showVersionInfo },
  } = useConfig()

  return (
    <div
      className={classNames('relative z-[1201] shadow', {
        'hidden sm:block': isDrawerOpen,
      })}
      style={{ backgroundColor: lightTheme ? 'transparent' : themeColor || undefined }}
      id="cy-navbar"
    >
      <div className="flex min-h-[64px] items-center px-4">
        <Logo className="mr-4 hidden md:flex" />
        <Form
          fields={['phrase']}
          onChange={(fields: any) => onSearch(fields.phrase)}
          runOnChangeInitially
          className="w-[202px] md:w-auto"
        >
          <SearchInput name="phrase" placeholder={translations.search} loading={searchLoading} noBottomGutter />
        </Form>
        <div className="ml-4 flex-1 opacity-30">
          {showVersionInfo && (
            <div className="hidden lg:block">
              <Version />
            </div>
          )}
        </div>
        <div className="flex items-center gap-4 text-white">
          <Button
            variant="default"
            className="hidden lg:block"
            href="https://patronite.pl/Wiating.eu"
            size="medium"
            target="_blank"
            rel="noopener noreferrer"
          >
            Wesprzyj nas
          </Button>
          {!authLoading && !isLoggedIn && (
            <Dropdown
              items={languages.map(lang => ({
                label: lang.toUpperCase(),
                callback: () => setLanguage(lang),
              }))}
            >
              <span className="opacity-90 hover:opacity-95">{language ? language.toUpperCase() : ''}</span>
            </Dropdown>
          )}
          {authLoading ? (
            <Loader />
          ) : (
            <Dropdown items={links}>
              {isLoggedIn ? (
                <div className="group flex items-center">
                  <Avatar alt={user?.name} src={user?.picture}>
                    {!user?.picture && `${user?.given_name?.charAt(0) || ''}${user?.family_name?.charAt(0) || ''}`}
                  </Avatar>
                  <span className="text-md ml-2 hidden whitespace-nowrap normal-case opacity-90 group-hover:opacity-95 md:inline">
                    {user?.name && user.name}
                  </span>
                  <ChevronDown className="ml-1 opacity-90 group-hover:opacity-95" size={20} />
                </div>
              ) : (
                <Menu className="opacity-90 hover:opacity-95" size={24} />
              )}
            </Dropdown>
          )}
        </div>
      </div>
    </div>
  )
}

export default NavBar
