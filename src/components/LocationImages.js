import React from 'react'
import { Box, Button, Modal, IconButton } from '@material-ui/core'
import { Close } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'
import { Carousel } from 'react-responsive-carousel'
import ImageGallery from 'react-image-gallery'
import Dropzone from 'react-dropzone'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import 'react-image-gallery/styles/css/image-gallery.css'
import Loader from './Loader'
import useLanguage from '../utils/useLanguage'


const LocationImages = ({
  images,
  id,
  uploading,
  onImageUpload,
}) => {
  const classes = useStyles()
  const { translations } = useLanguage()
  const [openModal, setOpenModal] = React.useState(false)

  React.useEffect(() => {
    setOpenModal(false)
  }, [images])

  const preparedImages = images
    ? images.map(image => ({
      original: `${process.env.FRONTEND_CDN_URL}/${id}/${image.name}`,
      thumbnail: `${process.env.FRONTEND_CDN_URL}/${id}/${image.name.replace('.jpg', '_m.jpg')}`,
    }))
    : null

  return (
    <div className={classes.root}>
      {images?.length
        ? uploading
          ? <div className={classes.imageWrapper}>
            <div className={classes.loader}><Loader big /></div>
          </div>
          : <>
            <Modal
              open={openModal}
              onClose={() => setOpenModal(false)}
              disableAutoFocus
              disableEnforceFocus
            >
              <Box boxShadow={3} className={classes.modalContent}>
                <ImageGallery
                  items={preparedImages}
                  showPlayButton={false}
                  showFullscreenButton={false}
                />
                <IconButton
                  className={classes.close}
                  onClick={() => setOpenModal(false)}
                ><Close /></IconButton>
              </Box>
            </Modal>
            <Carousel
              showArrows
              emulateTouch
              showThumbs={false}
            >
              {preparedImages.map((image, i) =>
                <div
                  key={i}
                  className={classes.imageWrapper}
                  onClick={() => setOpenModal(true)}
                >
                  <img src={image.thumbnail} alt='' className={classes.image} />
                </div>
              )}
            </Carousel>
          </>
        : <div className={classes.imageWrapper}>
          <img src='/no-image.png' alt='No image' className={classes.image} />
        </div>
      }
      <Button
        className={classes.addPhoto}
        size='small'
        variant='contained'
        color='primary'
      >
        <Dropzone accept='image/jpeg' onDrop={files => onImageUpload(files)}>
          {({ getRootProps, getInputProps }) => (
            <section>
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                {translations.actions.addPhoto}
              </div>
            </section>
          )}
        </Dropzone>
      </Button>
    </div>
  )
}

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
  },
  imageWrapper: {
    height: '50vw',
    [theme.breakpoints.up('sm')]: {
      height: 240,
    },
  },
  image: {
    objectFit: 'cover',
    width: '100%',
    height: '100%',
  },
  loader: {
    height: '100%',
    backgroundColor: theme.palette.grey[300],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    position: 'relative',
    backgroundColor: 'white',
    height: '100vh',
    [theme.breakpoints.up('md')]: {
      width: '80vw',
      height: '80vh',
      marginTop: '6vw',
      marginLeft: '10vw',
    },
    '& .image-gallery, & .image-gallery-content, & .image-gallery-swipe, & .image-gallery-slides, & .image-gallery-slides *': {
      height: '100%',
    },
    '& .image-gallery-slide-wrapper': {
      height: 'calc(100% - 80px)',
      [theme.breakpoints.up('sm')]: {
        height: 'calc(100% - 110px)',
      },
    },
    '& .image-gallery-image': {
      backgroundColor: theme.palette.grey[900],
      height: '100%',
      '& img': {
        objectFit: 'contain',
        width: '100%',
        height: '100%',
      },
    },
  },
  close: {
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1),
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  addPhoto: {
    position: 'absolute',
    bottom: theme.spacing(1),
    left: theme.spacing(1),
    padding: '1px 6px',
  },
}))

export default LocationImages
