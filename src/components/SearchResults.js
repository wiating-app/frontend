import React from 'react'
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Avatar,
  Typography,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { Home } from '@material-ui/icons'

const SearchResults = ({
  items,
  setMapCenter,
  setSelectedLocation,
  setContent,
}) => {
  const classes = useStyles()
  return (
    <List>
      {items && items.length
        ? items.map((item, index) =>
          <React.Fragment key={index}>
            <ListItem
              className={classes.item}
              onClick={() => {
                const { lon, lat } = item._source.location
                setContent('markerInfo')
                setSelectedLocation(item._source)
                setMapCenter(lon, lat)
              }}
            >
              <ListItemAvatar>
                <Avatar><Home /></Avatar>
              </ListItemAvatar>
              <ListItemText primary={item._source.name} secondary={item._source.description} />
            </ListItem>
            <Divider variant='inset' component='li' />
          </React.Fragment>
        )
        : <Typography variant='subtitle1' align='center'>Nic nie znaleziono</Typography>
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
}))

export default SearchResults
