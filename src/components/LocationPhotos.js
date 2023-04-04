import 'react-responsive-carousel/lib/styles/carousel.min.css'
import 'react-image-gallery/styles/css/image-gallery.css'

import { AddAPhoto, Close } from '@material-ui/icons'
import { Box, Button, IconButton, Modal, Tooltip } from '@material-ui/core'

import { Carousel } from 'react-responsive-carousel'
import ImageGallery from 'react-image-gallery'
import Loader from './Loader'
import React from 'react'
import loadImage from 'image-promise'
import { makeStyles } from '@material-ui/core/styles'
import useLanguage from '../utils/useLanguage'

const LocationPhotos = ({
  location,
  uploading,
  uploadImages,
}) => {
  const classes = useStyles()
  const { translations } = useLanguage()
  const [openModal, setOpenModal] = React.useState(false)
  const [currentPhoto, setCurrentPhoto] = React.useState(0)
  const [loading, setLoading] = React.useState(true)
  const [preparedImages, setPreparedImages] = React.useState([])

  React.useEffect(() => {
    // Precache the first cover image then disable loading state.
    if (preparedImages.length) {
      loadImage(preparedImages[0].thumbnail).then(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [preparedImages])

  React.useEffect(() => {
    const { id, images } = location
    setOpenModal(false)
    setLoading(true)
    setPreparedImages(images?.length
      ? location.images.map(image => ({
        original: `${process.env.FRONTEND_CDN_URL}/${id}/${image.name}`,
        thumbnail: `${process.env.FRONTEND_CDN_URL}/${id}/${image.name.replace('.jpg', '_m.jpg')}`,
      }))
      : []
    )
  }, [location])

  return (
    <div className={classes.root}>
      {loading || uploading
        ? <div className={classes.imageWrapper}>
          <div className={classes.loader}><Loader big /></div>
        </div>
        : location.images?.length
          ? <>
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
                  startIndex={currentPhoto}
                  onSlide={index => setCurrentPhoto(index)}
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
              onChange={index => setCurrentPhoto(index)}
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
      <Tooltip title={translations.addPhoto} placement='bottom-left'>
        <Button
          className={classes.addPhoto}
          variant='contained'
          color='primary'
          onClick={uploadImages}
        ><AddAPhoto /></Button>
      </Tooltip>
    </div>
  )
}

const useStyles = makeStyles(theme => ({
  '@keyframes appear': {
    '0%': {
      height: 0,
      opacity: 0,
      backgroundColor: 'transparent',
    },
    '100%': {
      height: '50vw',
      opacity: 1,
      backgroundColor: theme.palette.grey[300],
    },
  },
  root: {
    position: 'relative',
    height: 240,
    backgroundColor: theme.palette.grey[300],
    overflow: 'hidden',
    [theme.breakpoints.down('xs')]: {
      animation: `$appear 500ms ${theme.transitions.easing.easeInOut} forwards`,
    },
    '& .carousel .control-dots': {
      marginBottom: theme.spacing(3),
    },
  },
  imageWrapper: {
    height: 240,
    [theme.breakpoints.down('xs')]: {
      height: '50vw',
    },
  },
  image: {
    objectFit: 'cover',
    width: '100%',
    height: '100%',
  },
  loader: {
    height: '100%',
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
    top: theme.spacing(1),
    left: theme.spacing(1),
    padding: '1px 6px',
    zIndex: 1,
    color: theme.palette.grey[800],
    backgroundColor: 'rgba(255, 255, 255, 0.67)',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
  },
}))

export default LocationPhotos
