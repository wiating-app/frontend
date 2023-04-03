import useConfig from '../utils/useConfig'

const generateMarkerIcon = (type, size = 40) => {
  const { locationTypes } = useConfig()
  const locationType = locationTypes.find(item => item.id === type)
  const color = locationType?.color || 'grey'

  if (size <= 10) {
    return `
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 ${size} ${size}"
        width="${size}"
        height="${size}"
      >
        <circle
          cx="${size / 2}"
          cy="${size / 2}"
          r="${size / 2}"
          fill="${color}"
        />
        <circle
          cx="${size / 2}"
          cy="${size / 2}"
          r="${size / 4.5}"
          fill="#ffffff"
        />
      </svg>
    `
  } else {
    try {
      return locationType.icon
        .replace(/\$COLOR/g, color)
        .replace(/\$SIZE/g, size)
    } catch (err) {
      console.error(err)
    }
  }
}

export default generateMarkerIcon
