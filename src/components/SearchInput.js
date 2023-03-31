import React from 'react'
import { withFormControl } from '@react-form-component/mui'
import { TextField } from '@material-ui/core'
import { alpha, makeStyles } from '@material-ui/core/styles'
import { Search } from '@material-ui/icons'
import Loader from './Loader'
import useConfig from '../utils/useConfig'


const SearchInput = ({
  name,
  value,
  mandatory,
  setValue,
  placeholder,
  size,
  loading,
}) => {
  const { branding: { lightTheme } } = useConfig()
  const classes = useStyles({ lightTheme })
  return (
    <TextField
      id={name}
      name={name}
      placeholder={placeholder}
      defaultValue={value}
      margin='none'
      variant='outlined'
      size={size}
      onKeyPress={e => {
        if (e.key === 'Enter') {
          e.preventDefault()
          setValue(name, e.target.value, mandatory)
        }
      }}
      onChange={e => setValue(name, e.target.value, mandatory)}
      InputProps={{
        startAdornment: <div className={classes.icon}>{loading ? <Loader /> : <Search />}</div>,
        classes: {
          root: classes.root,
          input: classes.input,
        },
        'aria-label': 'search',
      }}
    />
  )
}

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
    margin: 0,
    width: 'auto',
    backgroundColor: ({ lightTheme }) => alpha(lightTheme ? theme.palette.common.black : theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: ({ lightTheme }) => alpha(lightTheme ? theme.palette.common.black : theme.palette.common.white, 0.25),
    },
    '& fieldset': {
      border: 'none',
    },
  },
  icon: {
    color: ({ lightTheme }) => lightTheme ? theme.palette.grey[500] : 'white',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    color: ({ lightTheme }) => lightTheme ? undefined : 'white',
    paddingLeft: theme.spacing(1),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 200,
    },
  },
}))

export default withFormControl(SearchInput)
