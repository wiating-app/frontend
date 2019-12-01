import React from 'react'
import { AppBar, Toolbar, Typography, Button, Avatar } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { ArrowDropDown } from '@material-ui/icons'
import Form from 'react-standalone-form'
import Dropdown from './Dropdown'
import SearchInput from './SearchInput'
import Text from './Text'


const NavBar = ({
  user,
  logout,
  loginWithRedirect,
  onSearch,
  language,
  languages,
  setLanguage,
}) => {
  const classes = useStyles()
  const [searchLoading, setSearchLoading] = React.useState()

  return (
    <AppBar position='relative' className={classes.root}>
      <Toolbar>
        <Typography variant='h6' className={classes.title}>Wiating</Typography>
        <Form
          fields={['phrase']}
          callbackOnChange={async fields => {
            setSearchLoading(true)
            await onSearch(fields.phrase)
            setSearchLoading(false)
          }}
        >
          <SearchInput
            name='phrase'
            // placeholder={<Text id='search' />} TODO: Placeholder translation support.
            noBottomGutter
            loading={searchLoading}
          />
        </Form>
        <div className={classes.grow} />
        <Dropdown
          items={languages.map(lang => ({
            label: lang.toUpperCase(),
            onClick: () => setLanguage(lang),
          }))}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >{language.toUpperCase()}</Dropdown>
        {user
          ? <Dropdown items={[
            { label: <Text id='auth.logout' />, onClick: () => logout() },
          ]}>
            <Avatar alt={user.name} src={user.picture}
            >{!user.picture && `${user.given_name.charAt(0)}${user.family_name.charAt(0)}`}</Avatar>
            <Typography className={classes.name}>{user.name && user.name}</Typography>
            <ArrowDropDown />
          </Dropdown>
          : <Button
            color='inherit'
            onClick={() => loginWithRedirect({})}
          ><Text id='auth.login' /></Button>
        }
      </Toolbar>
    </AppBar>
  )
}


const useStyles = makeStyles(theme => ({
  root: {
    zIndex: theme.zIndex.drawer + 1,
  },
  searchWrapper: {
    flexGrow: 1,
  },
  search: {
    maxWidth: 240,
  },
  name: {
    marginLeft: theme.spacing(1),
    textTransform: 'none',
    whiteSpace: 'nowrap',
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  grow: {
    flexGrow: 1,
  },
}))

export default NavBar
