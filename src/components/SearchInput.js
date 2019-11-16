import React from 'react'
import { withFormControl } from 'react-standalone-form'
import { InputBase } from '@material-ui/core'
import { fade, makeStyles } from '@material-ui/core/styles'
import { Search } from '@material-ui/icons'

const SearchInput = ({
  name,
  value,
  required,
  setValue,
  placeholder,
}) => {
  const classes = useStyles()
  return (
    <div className={classes.search}>
      <div className={classes.searchIcon}>
        <Search />
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
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(2),
    width: 'auto',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
    },
  },
  searchIcon: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(7),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      paddingLeft: theme.spacing(7),
      width: 200,
    },
  },
}))

export default withFormControl(SearchInput)
