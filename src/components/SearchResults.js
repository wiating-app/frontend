import React from 'react'
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Typography,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Text from './Text'
import { getIconUrl } from '../utils/helpers'

const SearchResults = ({
  items,
  setCachedLocation,
}) => {
  const classes = useStyles()
  return (
    <List>
      {items.length
        ? items.map((item, index) =>
          <React.Fragment key={index}>
            <ListItem
              className={classes.item}
              onClick={() => {
                setCachedLocation( item )
              }}
            >
              <ListItemAvatar>
                <img src={getIconUrl(item.type)} className={classes.listAvatar} />
              </ListItemAvatar>
              <ListItemText primary={item.name} secondary={item.description} />
            </ListItem>
            <Divider variant='inset' component='li' />
          </React.Fragment>
        )
        : <Typography variant='subtitle1' align='center'><Text id='noResults' /></Typography>
      }
    </List>
  )
}

const useStyles = makeStyles(theme => ({
  item: {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.grey[100],
    },
  },
  listAvatar: {
    width: 45,
    height: 45,
  },
}))

export default SearchResults
