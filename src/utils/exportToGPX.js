import locationTypes from './locationTypes'
import texts from './translations'

const exportToGPX = locations => {
  // Currently only polish language is supported.
  try {
    const today = new Date()
    const dd = String(today.getDate()).padStart(2, '0')
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const yyyy = today.getFullYear()
    const date = `${yyyy}-${mm}-${dd}`

    const header = [
      `<?xml version="1.0" encoding="UTF-8"?>`,
      `<gpx version="1.1" creator="Wiating" xmlns="http://www.topografix.com/GPX/1/1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">`,
      `  <metadata>`,
      '    <name>Wiating</name>',
      `    <desc>Eksport z aplikacji Wiating z dnia ${date}.</desc>`,
      `    <link href="https://wiating.eu">`,
      `      <text>Wiating</text>`,
      `    </link>`,
      `    <time>${date}</time>`,
      `  </metadata>`,
    ]
    const footer = [
      '</gpx>',
    ]

    const placemarks = locations.reduce((acc, location) => [
      ...acc,
      `  <wpt lat="${location.location.lat}" lon="${location.location.lng}">`,
      `    <name>${location.name}</name>`,
      `    <link href="https://wiating.eu/location/${location.id}">`,
      `      <text>wiating.eu</text>`,
      `    </link>`,
      `    <sym>https://wiating.eu/location-icons/${location.type}.png</sym>`,
      `    <desc>[${texts.pl.locationType[locationTypes[location.type].label]}] ${location.description} || Wskazówki dojścia: ${location.directions || 'Brak informacji.'} || Dostęp do wody: ${!location.water_exists ? 'brak.' : location.water_comment || 'jest.'} || Dostęp do ognia:</strong> ${!location.fire_exists ? 'brak.' : location.fire_comment || 'jest.'}</desc>`,
      '  </wpt>',
    ], [])

    const xml = [
      ...header,
      ...placemarks,
      ...footer,
    ].join('\n')

    const type = 'text/gpx'
    const blob = new Blob([xml], { type })
    const dataURI = `data:${type};charset=utf-8,${xml}`

    const URL = window.URL || window.webkitURL

    const buildedURI = (typeof URL.createObjectURL === 'undefined')
      ? dataURI
      : URL.createObjectURL(blob)

    let downloadLink = document.createElement('a')
    downloadLink.href = buildedURI
    downloadLink.download = `wiating-${date}.gpx`
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
  } catch (err) {
    console.error(err)
  }
}

export default exportToGPX
