import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'

const LocationImages = ({ images, id }) => {
  const classes = useStyles()
  return (
    images
      ? <Carousel showArrows emulateTouch>
        {images.map((image, i) => {
          const url = process.env.REACT_APP_S3_URL + '/' + id + '/' + image.name
          return (
            <div key={i} className={classes.imageWrapper}>
              <img src={url} alt='' className={classes.image} />
            </div>
          )
        })}
      </Carousel>
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
}))

export default LocationImages
