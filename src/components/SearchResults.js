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
import useLanguage from '../utils/useLanguage'
import { getIconUrl } from '../utils/helpers'

const SearchResults = ({
  items,
  setCachedLocation,
}) => {
  const classes = useStyles()
  const { translations } = useLanguage()
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
        : <Typography variant='subtitle1' align='center'>{translations.noResults}</Typography>
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
