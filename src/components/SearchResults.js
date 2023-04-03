import React from 'react'
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Typography,
  Chip,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useRecoilState } from 'recoil'
import { searchResultsState, activeLocationState } from '../state'
import useLanguage from '../utils/useLanguage'
import generateMarkerIcon from '../utils/generateMarkerIcon'
import history from '../history'

const SearchResults = () => {
  const [searchResults] = useRecoilState(searchResultsState)
  const [, setActiveLocation] = useRecoilState(activeLocationState)
  const classes = useStyles()
  const { translations } = useLanguage()
  return (
    <List>
      {searchResults.length
        ? searchResults.map((item, index) =>
          <React.Fragment key={index}>
            <ListItem
              className={classes.item}
              onClick={() => {
                setActiveLocation(item)
                history.push(`/location/${item.id}`)
              }}
            >
              <ListItemAvatar>
                <div
                  dangerouslySetInnerHTML={{ __html: generateMarkerIcon(item.type) }}
                  className={classes.listAvatar}
                />
              </ListItemAvatar>
              <ListItemText
                primary={item.name}
                secondary={item.is_disabled
                  ? <Chip
                    size='small'
                    color='secondary'
                    label={translations.isDisabled}
                  />
                  : item.description && item.description.substring(0, 70)
                }
                secondaryTypographyProps={{ component: 'div' }}
              />
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
