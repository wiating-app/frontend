import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Grid } from '@material-ui/core'
import Form from 'react-standalone-form'
import { Input, Select, FormButton } from 'react-standalone-form-mui'


const LogFilters = ({ values, callback }) => {
  const classes = useStyles()
  return (
    <Form
      fields={['id', 'reviewed_at']}
      className={classes.root}
    >
      <Grid container alignItems='flex-end' spacing={2}>
        <Grid item xs={12} sm={5} md={4}>
          <Input
            name='id'
            label='Szukaj po ID lokacji'
            initialValue={values?.id}
            noBottomGutter
          />
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <Select
            name='reviewed_at'
            label='Stan weryfikacji'
            options={[
              { label: 'Zweryfikowane', value: 'true' },
              { label: 'Niezweryfikowane', value: 'false' },
            ]}
            initialValue={values?.verified}
            noBottomGutter
          />
        </Grid>
        <Grid item>
          <FormButton
            variant='contained'
            color='primary'
            callback={callback}
          >Filtruj</FormButton>
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
