import Form, { SubmitButton, Input, Select } from '@react-form-component/mui'
import { Grid } from '@material-ui/core'
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import useLanguage from '../utils/useLanguage'
import useConfig from '../utils/useConfig'

const LogFilters = ({ values, handleSubmit, handleReset }) => {
  const classes = useStyles()
  const { translations } = useLanguage()
  const { settings: { enableVerification } } = useConfig()

  return (
    <Form
      fields={['id', 'reviewed_at']}
      className={classes.root}
    >
      <Grid container alignItems='center' spacing={2}>
        <Grid item xs={12} sm={5} md={4}>
          <Input
            name='id'
            label={translations.findById}
            initialValue={values?.id}
            noBottomGutter
          />
        </Grid>
        {enableVerification &&
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
        }
        <Grid item>
          <SubmitButton
            variant='contained'
            color='primary'
            onClick={handleSubmit}
          >{translations.filter}</SubmitButton>
        </Grid>
        {values && Object.keys(values).length
          ? <Grid item>
            <SubmitButton onClick={handleReset}>{translations.reset}</SubmitButton>
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
