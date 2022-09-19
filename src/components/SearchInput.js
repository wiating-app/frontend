import React from 'react'
import { withFormControl } from '@react-form-component/mui'
import { TextField } from '@material-ui/core'
import { alpha, makeStyles } from '@material-ui/core/styles'
import { Search } from '@material-ui/icons'
import Loader from './Loader'


const SearchInput = ({
  name,
  value,
  mandatory,
  setValue,
  placeholder,
  size,
  loading,
}) => {
  const classes = useStyles()
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
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    '& fieldset': {
      border: 'none',
    },
  },
  icon: {
    color: 'white',
    height: '100%',
    // position: 'absolute',
    // pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    // width: theme.spacing(5),
    // [theme.breakpoints.up('sm')]: {
    //   width: theme.spacing(7),
    // },
  },
  input: {
    color: 'white',
    // padding: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      // paddingLeft: theme.spacing(7),
      width: 200,
    },
  },
}))

export default withFormControl(SearchInput)
