import React from 'react'
import { Box, Modal } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { Carousel } from 'react-responsive-carousel'
import ImageGallery from 'react-image-gallery'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import 'react-image-gallery/styles/css/image-gallery.css'


const LocationImages = ({ images, id }) => {
  const classes = useStyles()
  const [openModal, setOpenModal] = React.useState(false)

  const preparedImages = images
    ? images.map(image => ({
      original: `${process.env.REACT_APP_S3_URL}/${id}/${image.name}`,
      thumbnail: `${process.env.REACT_APP_S3_URL}/${id}/${image.name.replace('.jpg', '_m.jpg')}`,
    }))
    : null

  return (
    images
      ? <>
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
          </Box>
        </Modal>
      </>
      : <div className={classes.imageWrapper}>
        <img src='/no-image.png' alt='No image' className={classes.image} />
      </div>
  )
}

const useStyles = makeStyles(theme => ({
  imageWrapper: {
    height: 240,
  },
  image: {
    objectFit: 'cover',
    width: '100%',
    height: '100%',
  },
  modalContent: {
    width: '80vw',
    marginTop: '5vw',
    marginLeft: '10vw',
    backgroundColor: 'white',
    '& .image-gallery-image': {
      maxWidth: '80vw',
      maxHeight: '70vh',
    },
  },
}))

export default LocationImages
