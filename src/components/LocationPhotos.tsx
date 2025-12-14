import React from 'react'
import loadImage from 'image-promise'
import { ArrowLeft, Camera } from 'lucide-react'
import { createPortal } from 'react-dom'
import ImageGallery from 'react-image-gallery'
import 'react-image-gallery/styles/css/image-gallery.css'
import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import { Image, Location } from '../typings'
import useLanguage from '../utils/useLanguage'
import IconButton from './IconButton'
import Loader from './Loader'
import { Tooltip } from './Tooltip'

interface LocationPhotosProps {
  location: Location
  uploading: boolean
  uploadImages: () => void
}

interface PreparedImage {
  original: string
  thumbnail: string
}

// Single source of truth for photo container height (mobile-first)
const PHOTO_CONTAINER_HEIGHT = 'h-[70vw] sm:h-[260px]'

const LocationPhotos = ({ location, uploading, uploadImages }: LocationPhotosProps) => {
  const { translations } = useLanguage()
  const [openModal, setOpenModal] = React.useState(false)
  const [currentPhoto, setCurrentPhoto] = React.useState(0)
  const [loading, setLoading] = React.useState(true)
  const [preparedImages, setPreparedImages] = React.useState<PreparedImage[]>([])

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
    setPreparedImages(
      images?.length
        ? location.images.map((image: Image) => ({
            original: `${process.env.FRONTEND_CDN_URL}/${id}/${image.name}`,
            thumbnail: `${process.env.FRONTEND_CDN_URL}/${id}/${image.name.replace('.jpg', '_m.jpg')}`,
          }))
        : [],
    )
  }, [location])

  return (
    <div className={`relative bg-gray-300 ${PHOTO_CONTAINER_HEIGHT} animate-fade-in`}>
      {loading || uploading ? (
        <div className={PHOTO_CONTAINER_HEIGHT}>
          <div className="flex h-full items-center justify-center">
            <Loader big />
          </div>
        </div>
      ) : location.images?.length ? (
        <>
          {openModal &&
            createPortal(
              <div
                className="fixed inset-0 z-[1300] flex items-center justify-center bg-black/90"
                onClick={() => setOpenModal(false)}
              >
                <div className="absolute w-full md:left-0 md:right-0 md:w-auto" onClick={e => e.stopPropagation()}>
                  <style>{`
                        /* ensure full height for gallery container and slides */
                        .image-gallery-image {
                          height: 70vh;
                        }
                      `}</style>
                  <ImageGallery
                    items={preparedImages}
                    showPlayButton={false}
                    showFullscreenButton={false}
                    startIndex={currentPhoto}
                    onSlide={(index: number) => setCurrentPhoto(index)}
                  />
                </div>
                <IconButton
                  className="absolute left-3 top-3 z-[1400]"
                  onClick={() => setOpenModal(false)}
                  variant="transparent"
                >
                  <ArrowLeft size={24} />
                </IconButton>
              </div>,
              document.body,
            )}
          <style>{`
                  /* react-responsive-carousel: spacing for navigation dots */
                  .carousel .control-dots {
                    margin-bottom: 24px;
                  }
                  .carousel .control-dots .dot {
                    opacity: 0.5;
                    box-shadow: 0 0 0 1px rgba(0,0,0,0.4);
                  }
                `}</style>
          <Carousel showArrows emulateTouch showThumbs={false} onChange={(index: number) => setCurrentPhoto(index)}>
            {preparedImages.map((image, i) => (
              <div key={i} className={`${PHOTO_CONTAINER_HEIGHT} cursor-pointer`} onClick={() => setOpenModal(true)}>
                <img
                  src={image.thumbnail}
                  alt=""
                  className="h-full w-full object-cover"
                  style={{ minWidth: 0, minHeight: 0, flexShrink: 0 }}
                />
              </div>
            ))}
          </Carousel>
        </>
      ) : (
        <div className={PHOTO_CONTAINER_HEIGHT}>
          <img
            src="/no-image.png"
            alt="No image"
            className="h-full w-full object-cover"
            style={{ minWidth: 0, minHeight: 0, flexShrink: 0 }}
          />
        </div>
      )}
      <button
        className="absolute left-1 top-1 cursor-pointer rounded border-none bg-gray-200 px-1.5 pt-1 text-gray-800 hover:bg-gray-100"
        onClick={uploadImages}
      >
        <Tooltip content={translations.addPhoto} anchor="right-center">
          <Camera size={24} />
        </Tooltip>
      </button>
    </div>
  )
}

export default LocationPhotos
