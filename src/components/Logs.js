import React from 'react'
import { Link } from 'react-router-dom'
import { Typography, Tooltip } from '@material-ui/core'
import { OpenInNew } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'
import Modal from './Modal'
import Table from './Table'
import Pagination from './Pagination'
import Actions from './Actions'
import Loader from './Loader'
import useLanguage from '../utils/useLanguage'


const Logs = ({
  logs,
  loadingLogs,
  errorLogs,
  page,
  setPage,
  rowsInTotal,
  rowsPerPage,
  setDetails,
}) => {
  const { translations } = useLanguage()
  const classes = useStyles()
  return (
    <Modal wide>
      <Typography
        variant='h4'
        gutterBottom
      >Administracja - historia zmian</Typography>
      {loadingLogs
        ? <Loader dark big />
        : errorLogs
          ? <Typography color='error'>{translations.connectionProblem.logs}</Typography>
          : <>
            <Table
              data={logs.map(item => ({
                timestamp: item._source.timestamp,
                location: <Tooltip title='Przejdź do lokacji' placement='right'>
                  <Link
                    to={`/location/${item._source.doc_id}`}
                    target='_blank'
                    className={classes.link}
                  >{item._source.name} <OpenInNew style={{ fontSize: 12 }} />
                  </Link>
                </Tooltip>,
                user: item._source.modified_by,
                actions: <Actions
                  primary={[
                    { label: 'Szczegóły', action: () => setDetails({ id: item._id, ...item._source }) },
                  ]}
                />,
              }))}
              labels={[
                { name: 'Data', field: 'timestamp' },
                { name: 'Lokacja', field: 'location' },
                { name: 'Identyfikator użytkownika', field: 'user' },
                { name: '', field: 'actions' },
              ]}
            />
            {rowsInTotal > rowsPerPage &&
              <Pagination
                count={rowsInTotal}
                rowsPerPage={rowsPerPage}
                page={page}
                callback={newPage => setPage(newPage)}
              />
            }
          </>
      }
    </Modal>
  )
}

const useStyles = makeStyles(theme => ({
  link: {
    cursor: 'pointer',
    fontWeight: theme.typography.fontWeightBold,
    color: theme.palette.text.primary,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
}))

export default Logs
