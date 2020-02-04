import React from 'react'
import { withFormControl } from 'react-standalone-form-mui'
import { InputBase } from '@material-ui/core'
import { fade, makeStyles } from '@material-ui/core/styles'
import { Search } from '@material-ui/icons'
import Loader from './Loader'


const SearchInput = ({
  name,
  value,
  required,
  setValue,
  placeholder,
  loading,
}) => {
  const classes = useStyles()
  return (
    <div className={classes.search}>
      <div className={classes.searchIcon}>
        {loading ? <Loader /> : <Search />}
      </div>
      <InputBase
        name={name}
        placeholder={placeholder}
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput,
        }}
        inputProps={{ 'aria-label': 'search' }}
        defaultValue={value}
        onKeyPress={e => {
          if (e.key === 'Enter') {
            e.preventDefault()
            setValue(name, e.target.value, required)
          }
        }}
        onChange={e => setValue(name, e.target.value, required)}
      />
    </div>
  )
}

const useStyles = makeStyles(theme => ({
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    width: 'auto',
  },
  searchIcon: {
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: theme.spacing(5),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(7),
    },
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(5),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      paddingLeft: theme.spacing(7),
      width: 200,
    },
  },
}))

export default withFormControl(SearchInput)
