import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Grid } from '@material-ui/core'
import Form from 'react-standalone-form'
import { Input, Select, FormButton } from 'react-standalone-form-mui'
import useLanguage from '../utils/useLanguage'


const LogFilters = ({ values, handleSubmit, handleReset }) => {
  const classes = useStyles()
  const { translations } = useLanguage()
  return (
    <Form
      fields={['id', 'reviewed_at']}
      className={classes.root}
    >
      <Grid container alignItems='flex-end' spacing={2}>
        <Grid item xs={12} sm={5} md={4}>
          <Input
            name='id'
            label={translations.findById}
            initialValue={values?.id}
            noBottomGutter
          />
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <Select
            name='reviewed_at'
            label={translations.verificationState}
            options={[
              { label: translations.verified, value: 'true' },
              { label: translations.unverified, value: 'false' },
            ]}
            placeholder={translations.all}
            initialValue={values?.reviewed_at?.toString()}
            noBottomGutter
          />
        </Grid>
        <Grid item>
          <FormButton
            variant='contained'
            color='primary'
            callback={handleSubmit}
          >{translations.filter}</FormButton>
        </Grid>
        {values && Object.keys(values).length
          ? <Grid item>
            <FormButton callback={handleReset}>{translations.reset}</FormButton>
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
