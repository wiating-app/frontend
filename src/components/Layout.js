import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

const Layout = ({ appBar, children }) => {
  const classes = useStyles()
  const [documentHeight, setDocumentHeight] = React.useState()

  React.useEffect(() => {
    // Correct sizing of viewport on mobile.
    const resizeListener = () => {
      setDocumentHeight(`${window.innerHeight}px`)
    }
    // Set size initially.
    resizeListener()
    // Set resize listener
    window.addEventListener('resize', resizeListener)
    // Clean up function
    return () => {
      window.removeEventListener('resize', resizeListener)
    }
  }, [])

  return (
    <div
      className={classes.root}
      style={documentHeight ? { height: documentHeight } : {}}
    >
      {appBar}
      <div className={classes.content}>
        {children}
      </div>
    </div>
  )
}

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
  },
  content: {
    flexGrow: 1,
    display: 'flex',
    overflow: 'hidden',
  },
}))

export default Layout
