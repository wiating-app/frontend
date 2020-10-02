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
  onImageUpload,
}) => {
  const classes = useStyles()
  const { translations } = useLanguage()
  const [openModal, setOpenModal] = React.useState(false)
  const [imagesLoading, setImagesLoading] = React.useState()

  const preparedImages = images
    ? images.map(image => ({
      original: `${process.env.REACT_APP_CDN_URL}/${id}/${image.name}`,
      thumbnail: `${process.env.REACT_APP_CDN_URL}/${id}/${image.name.replace('.jpg', '_m.jpg')}`,
    }))
    : null

  return (
    images?.length
      ? <div className={classes.root}>
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
        <Button
          className={classes.addPhoto}
          size='small'
          variant='contained'
          color='primary'
        >
          <Dropzone accept='image/jpeg' onDrop={async files => {
            setImagesLoading(true)
            await onImageUpload(files)
            setImagesLoading(false)
          }}>
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
      </div>
      : <div className={classes.imageWrapper}>
        <img src='/no-image.png' alt='No image' className={classes.image} />
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
