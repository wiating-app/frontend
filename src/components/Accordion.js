import React from 'react'
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Typography,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const AccordionContext = React.createContext([null, () => {}])


const Accordion = ({ children }) => {
  const [expanded, setExpanded] = React.useState()

  return (
    <AccordionContext.Provider value={[expanded, setExpanded]}>
      <div>{children}</div>
    </AccordionContext.Provider>
  )
}

export default Accordion


export const AccordionItem = ({ title, children, initiallyExpanded }) => {
  const [expanded, setExpanded] = React.useContext(AccordionContext)
  const classes = useStyles()
  const index = title.replace(' ', '-') // Use title as an unique identifier.

  React.useEffect(() => {
    if (initiallyExpanded) {
      setExpanded(index)
    }
  }, [])

  const handleChange = panel => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false)
  }

  return (
    <ExpansionPanel
      className={classes.root}
      expanded={expanded === index}
      classes={{ expanded: classes.expanded }}
      onChange={handleChange(index)}
      square
    >
      <ExpansionPanelSummary
        className={classes.summary}
        aria-controls={`${index}-content`}
        id={`${index}-header`}
      >
        <Typography variant='subtitle2'>{title}</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails className={classes.details}>
        {children}
      </ExpansionPanelDetails>
    </ExpansionPanel>
  )
}

const useStyles = makeStyles(theme => ({
  root: {
    border: '1px solid rgba(0, 0, 0, .125)',
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottomWidth: 0,
    },
    '&:last-child': {
      marginBottom: `${theme.spacing(4)}px !important`,
    },
  },
  expanded: {
    borderBottomWidth: '1px !important',
  },
  summary: {
    backgroundColor: 'rgba(0, 0, 0, .03)',
    borderBottom: '1px solid rgba(0, 0, 0, .125)',
    marginBottom: -1,
    minHeight: 56,
  },
  details: {
    padding: theme.spacing(2),
    display: 'block',
  },
}))
