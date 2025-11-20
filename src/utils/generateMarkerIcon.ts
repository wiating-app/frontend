import useConfig from './useConfig'

const generateMarkerIcon = (type: string | number, size: number = 40): string | undefined => {
  const config = useConfig()
  if (!config) return undefined
  const { locationTypes } = config
  const locationType = locationTypes.find(item => item.id === type)
  const color = (locationType as any)?.color || 'grey'

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
      return locationType?.icon
        ?.replace(/\$COLOR/g, color)
        ?.replace(/\$SIZE/g, String(size))
    } catch (err) {
      console.error(err)
      return undefined
    }
  }
}

export default generateMarkerIcon
