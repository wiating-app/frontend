import locationTypes from './locationTypes'
import locationPictograms from './locationPictograms'

const generateMarkerIcon = (type, size = 40) => {
  const color = locationTypes[type]?.color || 'grey'

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
      </svg>
    `
  } else {
    return `
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 37.234108 44.192665"
        width="${size}"
        height="${size}"
      >
        <g transform="translate(-98.509916,-52.280436)" >
          <path
            style="fill:${color};fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:0.03527778"
            d="m 103.96245,57.733102 c 7.27004,-7.269692 19.05811,-7.27075 26.32851,0 7.27075,7.270396 7.27075,19.05776 0,26.328121 l -11.87979,11.879511 c -0.70979,0.709824 -1.85879,0.709824 -2.56928,0 L 103.96245,84.061223 c -7.270046,-7.270361 -7.270046,-19.057725 0,-26.328121"
          />
          <path
            style="fill:#eff4f4"
            d="m 107.23869,80.73146 c 5.46065,5.460894 14.31537,5.460894 19.77602,0 5.461,-5.461423 5.461,-14.314381 0,-19.775734 -5.46065,-5.461352 -14.31537,-5.461352 -19.77531,0 -5.461,5.461353 -5.461,14.315017 -7.1e-4,19.775734"
          />
        </g>
        ${locationPictograms[type].replaceAll('$COLOR', color)}
      </svg>
    `
  }
}

export default generateMarkerIcon
