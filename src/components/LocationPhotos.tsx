import 'react-responsive-carousel/lib/styles/carousel.min.css'
import 'react-image-gallery/styles/css/image-gallery.css'

import { Camera, ArrowLeft } from 'lucide-react'
import { Carousel } from 'react-responsive-carousel'
import ImageGallery from 'react-image-gallery'
import Loader from './Loader'
import React from 'react'
import { createPortal } from 'react-dom'
import loadImage from 'image-promise'
import useLanguage from '../utils/useLanguage'
import { Location, Image } from '../typings'
import IconButton from './IconButton'
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

const LocationPhotos = ({
  location,
  uploading,
  uploadImages,
}: LocationPhotosProps) => {
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
    setPreparedImages(images?.length
      ? location.images.map((image: Image) => ({
        original: `${process.env.FRONTEND_CDN_URL}/${id}/${image.name}`,
        thumbnail: `${process.env.FRONTEND_CDN_URL}/${id}/${image.name.replace('.jpg', '_m.jpg')}`,
      }))
      : []
    )
  }, [location])

  return (
    <div className="relative bg-gray-300 h-[50vw] sm:h-[260px] animate-fade-in">
      {loading || uploading
        ? (
            <div className="h-[260px] max-sm:h-[50vw]">
              <div className="h-full flex items-center justify-center">
                <Loader big />
              </div>
            </div>
          )
        : location.images?.length
          ? (
              <>
                {openModal && createPortal(
                  <div
                    className="fixed inset-0 z-[1300] flex items-center justify-center bg-black/90"
                    onClick={() => setOpenModal(false)}
                  >
                    <div
                      className="absolute w-full md:left-0 md:right-0 md:w-auto"
                      onClick={(e) => e.stopPropagation()}
                    >
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
                        className="absolute top-3 left-3 z-[1400]"
                        onClick={() => setOpenModal(false)}
                        variant="transparent"
                      >
                        <ArrowLeft size={24} />
                      </IconButton>
                  </div>,
                  document.body
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
                <Carousel
                  showArrows
                  emulateTouch
                  showThumbs={false}
                  onChange={(index: number) => setCurrentPhoto(index)}
                >
                  {preparedImages.map((image, i) => (
                    <div
                      key={i}
                      className="h-[260px] max-sm:h-[50vw] cursor-pointer"
                      onClick={() => setOpenModal(true)}
                    >
                      <img
                        src={image.thumbnail}
                        alt=""
                        className="object-cover w-full h-full"
                        style={{ minWidth: 0, minHeight: 0, flexShrink: 0 }}
                      />
                    </div>
                  ))}
                </Carousel>
              </>
            )
          : (
              <div className="h-[260px] max-sm:h-[50vw]">
                <img
                  src="/no-image.png"
                  alt="No image"
                  className="object-cover w-full h-full"
                  style={{ minWidth: 0, minHeight: 0, flexShrink: 0 }}
                />
              </div>
            )
      }
        <button
          className="absolute top-1 left-1 px-1.5 pt-1 text-gray-800 bg-gray-300 hover:bg-gray-200 border-none cursor-pointer rounded"
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
