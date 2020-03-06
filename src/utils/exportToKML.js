import dot from 'dot-object'
import locationTypes from './locationTypes'
import texts from './texts'


const exportToKML = locations => {
  // Currently only polish language is supported.
  try {
    const today = new Date()
    const dd = String(today.getDate()).padStart(2, '0')
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const yyyy = today.getFullYear()
    const date = `${yyyy}-${mm}-${dd}`

    const header = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<kml xmlns="http://www.opengis.net/kml/2.2">',
      '  <Document>',
      '    <name>Wiating</name>',
      `    <description>Eksport z aplikacji Wiating (https://mapa.wiating.eu) z dnia ${date}.</description>`,
    ]
    const footer = [
      '  </Document>',
      '</kml>',
    ]

    // TODO: Add images support.
    const placemarks = locations.reduce((acc, { _source }) => [
      ...acc,
      '    <Placemark>',
      `      <name><![CDATA[[${dot.pick(locationTypes[_source.type], texts.pl)}] ${_source.name}]]></name>`,
      '      <description>',
      '        <![CDATA[',
      `          <p>${_source.description}</p>`,
      `          <p><strong>Wskazówki dojścia:</strong> ${_source.directions || 'Brak informacji.'}</p>`,
      `          <p><strong>Dostęp do wody:</strong> ${!_source.water_exists ? 'brak.' : water_comment || 'jest.'}</p>`,
      `          <p><strong>Dostęp do ognia:</strong> ${!_source.fire_exists ? 'brak.' : fire_comment || 'jest.'}</p>`,
      '        ]]>',
      '      </description>',
      '      <Point>',
      `        <coordinates>${_source.location.lon},${_source.location.lat},0</coordinates>`,
      '      </Point>',
      '    </Placemark>',
    ], [])

    const xml = [
      ...header,
      ...placemarks,
      ...footer,
    ].join('\n')

    const type = 'text/xml'
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
