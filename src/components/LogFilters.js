import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Grid } from '@material-ui/core'
import Form from 'react-standalone-form'
import { Input, FormButton } from 'react-standalone-form-mui'


const LogFilters = ({ values, callback }) => {
  const classes = useStyles()
  return (
    <Form fields={['id']} className={classes.root}>
      <Grid container alignItems='flex-end' spacing={2}>
        <Grid item>
          <Input
            name='id'
            label='Szukaj po ID lokacji'
            initialValue={values?.id}
            noBottomGutter
          />
        </Grid>
        <Grid item>
          <FormButton
            variant='contained'
            color='primary'
            callback={callback}
          >Szukaj</FormButton>
        </Grid>
        {values && Object.keys(values).length
          ? <Grid item>
            <FormButton callback={() => callback({})}>Resetuj filtry</FormButton>
          </Grid>
          : null
        }
      </Grid>
    </Form>
  )
}

const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: theme.spacing(3),
  },
}))

export default LogFilters
