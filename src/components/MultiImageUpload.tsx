import React from 'react'
import { Grid, Typography, IconButton } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { CloudUpload, Delete } from '@material-ui/icons'
import classNames from 'classnames'
import { withFormControl } from '@react-form-component/mui'


interface ImageFile {
  fileName: string
  type: string
  data: string
  dataFile: File
}

interface StyleProps {
  smHeight: string
  mdHeight: string
}

interface MultiImageUploadProps {
  name: string
  value?: ImageFile[]
  mandatory?: boolean
  setValue: (name: string, value: ImageFile[], mandatory?: boolean) => void
  spacing?: number
  columns?: number
  uploadLabel?: string
  smHeight?: string
  mdHeight?: string
}

const MultiImageUpload = ({
  name,
  value,
  mandatory,
  setValue,
  spacing = 2,
  columns = 2,
  uploadLabel = 'Upload',
  smHeight = '20vw',
  mdHeight = '12vw',
}: MultiImageUploadProps) => {
  const classes = useStyles({ smHeight, mdHeight })
  return (
    <Grid container spacing={spacing as any}>
      {value &&
        value.map((item, index) =>
          <Grid item sm={(12 / columns) as any} key={index}>
            <Grid
              container
              alignItems='center'
              justify='center'
              className={classes.wrapper}
            >
              <img
                src={item.data || item as any}
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
      <Grid item sm={(12 / columns) as any}>
        <input
          accept='image/*'
          className={classes.input}
          id={name}
          multiple
          type='file'
          onChange={e => {
            let oldValue = value || []
            Object.values(e.target.files || {}).forEach(async (file: File) => {
              const fileReader = new FileReader()
              const { name: fileName, type: fileType } = file
              const dataFile = file
              await fileReader.readAsDataURL(file)
              fileReader.onload = () => {
                const data = fileReader.result as string
                const newItem: ImageFile = {
                  fileName,
                  type: fileType.split('/')[0],
                  data,
                  dataFile,
                }
                setValue(
                  name,
                  [...oldValue, newItem],
                  mandatory
                )
                oldValue = [...oldValue, newItem]
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

const useStyles = makeStyles<import('@material-ui/core/styles').Theme, StyleProps>(theme => ({
  wrapper: {
    backgroundColor: theme.palette.grey[100],
    padding: theme.spacing(2),
    height: '33vw',
    position: 'relative',
    [theme.breakpoints.up('sm')]: {
      height: ({ smHeight }) => smHeight,
    },
    [theme.breakpoints.up('md')]: {
      height: ({ mdHeight }) => mdHeight,
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
