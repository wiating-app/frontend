import useConfig from '../utils/useConfig'

const exportToKML = locations => {
  const { locationTypes } = useConfig()
  // Currently only polish language is supported.
  try {
    const today = new Date()
    const dd = String(today.getDate()).padStart(2, '0')
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const yyyy = today.getFullYear()
    const date = `${yyyy}-${mm}-${dd}`
    const baseUrl = process.env.FRONTEND_CDN_URL

    const header = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<kml xmlns="http://www.opengis.net/kml/2.2">',
      '  <Document>',
      '    <name>Wiating</name>',
      `    <description>Eksport z aplikacji Wiating (https://wiating.eu) z dnia ${date}.</description>`,
      ...locationTypes.reduce((acc, { id }) => [
        ...acc,
        `    <Style id="icon-${id}">`,
        '      <IconStyle>',
        '        <scale>0.75</scale>',
        '        <Icon>',
        `          <href>https://wiating.eu/location-icons/${id}.svg</href>`,
        '        </Icon>',
        '      </IconStyle>',
        '    </Style>',
      ], []),
    ]
    const footer = [
      '  </Document>',
      '</kml>',
    ]

    const placemarks = locations.reduce((acc, location) => [
      ...acc,
      '    <Placemark>',
      `      <name>${location.name}</name>`,
      '      <description>',
      '        <![CDATA[',
      `          <p><strong>${locationTypes.find(item => item.id === location.type).label.pl}</strong></p>`,
      `          <p>${location.description}</p>`,
      `          <p><strong>Wskazówki dojścia:</strong> ${location.directions || 'Brak informacji.'}</p>`,
      `          <p><strong>Dostęp do wody:</strong> ${!location.water_exists ? 'brak.' : location.water_comment || 'jest.'}</p>`,
      `          <p><strong>Dostęp do ognia:</strong> ${!location.fire_exists ? 'brak.' : location.fire_comment || 'jest.'}</p>`,
      ...location.images
        ? location.images.map(item => `          <img src="${baseUrl}/${location.id}/${item.name}" width="100%" />`)
        : ['          <p>Brak zdjęć.</p>'],
      '        ]]>',
      '      </description>',
      `      <styleUrl>#icon-${location.type}</styleUrl>`,
      '      <Point>',
      `        <coordinates>${location.location.lng},${location.location.lat},0</coordinates>`,
      '      </Point>',
      '    </Placemark>',
    ], [])

    const xml = [
      ...header,
      ...placemarks,
      ...footer,
    ].join('\n')

    const type = 'text/kml'
    const blob = new Blob([xml], { type })
    const dataURI = `data:${type};charset=utf-8,${xml}`

    const URL = window.URL || window.webkitURL

    const buildedURI = (typeof URL.createObjectURL === 'undefined')
      ? dataURI
      : URL.createObjectURL(blob)

    let downloadLink = document.createElement('a')
    downloadLink.href = buildedURI
    downloadLink.download = `wiating-${date}.kml`
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
  } catch (err) {
    console.error(err)
  }
}

export default exportToKML
