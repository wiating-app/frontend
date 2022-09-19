import React from 'react'
import { Grid, Typography, IconButton } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { CloudUpload, Delete } from '@material-ui/icons'
import classNames from 'classnames'
import { withFormControl } from '@react-form-component/mui'


const MultiImageUpload = ({
  name,
  value,
  mandatory,
  setValue,
  spacing,
  columns,
  uploadLabel,
}) => {
  const classes = useStyles()
  return (
    <Grid container spacing={spacing}>
      {value &&
        value.map((item, index) =>
          <Grid item sm={12 / columns} key={index}>
            <Grid
              container
              alignItems='center'
              justify='center'
              className={classes.wrapper}
            >
              <img
                src={item.data || item}
                className={classes.image}
                alt={`Uploaded file ${index}`}
              />
              <IconButton
                className={classes.delete}
                onClick={() => setValue(
                  name,
                  value.filter((subItem, subIndex) => subIndex !== index),
                  mandatory
                )}
              >
                <Delete fontSize='small' />
              </IconButton>
            </Grid>
          </Grid>
        )
      }
      <Grid item sm={12 / columns}>
        <input
          accept='image/*'
          className={classes.input}
          id={name}
          multiple
          type='file'
          onChange={e => {
            let oldValue = value || []
            Object.values(e.target.files).forEach(async value => {
              const fileReader = new FileReader()
              const { name: fileName, type: fileType } = value
              const dataFile = value
              await fileReader.readAsDataURL(value)
              fileReader.onload = () => {
                const data = fileReader.result
                setValue(
                  name,
                  [...oldValue, {
                    fileName,
                    type: fileType.split('/')[0],
                    data,
                    dataFile,
                  }],
                  mandatory
                )
                oldValue = [...oldValue, {
                  fileName,
                  type: fileType.split('/')[0],
                  data,
                  dataFile,
                }]
              }
            })
          }}
        />
        <label htmlFor={name} className={classNames(classes.wrapper, classes.label)}>
          <CloudUpload />
          <Typography variant='caption' color='inherit'>{uploadLabel}</Typography>
        </label>
      </Grid>
    </Grid>
  )
}

MultiImageUpload.defaultProps = {
  spacing: 2,
  columns: 2,
  smHeight: '20vw',
  mdHeight: '12vw',
  uploadLabel: 'Upload',
}

const useStyles = makeStyles(theme => ({
  wrapper: {
    backgroundColor: theme.palette.grey[100],
    padding: theme.spacing(2),
    height: '33vw',
    position: 'relative',
    [theme.breakpoints.up('sm')]: {
      height: props => props.smHeight,
    },
    [theme.breakpoints.up('md')]: {
      height: props => props.mdHeight,
      maxHeight: theme.spacing(30),
    },
  },
  image: {
    maxWidth: '100%',
    maxHeight: '100%',
  },
  input: {
    display: 'none',
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.grey[500],
    '&:hover': {
      backgroundColor: theme.palette.grey[200],
    },
  },
  delete: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
}))

export default withFormControl(MultiImageUpload)
