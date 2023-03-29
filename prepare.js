#!/usr/bin/env node
const fs = require('fs/promises')
const sharp = require('sharp')
require('dotenv').config()

const applyConfig = async () => {
  try {
    // Read config
    const config = await fs.readFile(process.env.CUSTOMIZATION_URL, 'utf8')
    await fs.writeFile('customization.json', config)
    const { branding, settings } = JSON.parse(config)

    // Get favicon source
    const favicon = await fs.readFile(branding.favicon)
    await fs.writeFile('public/favicon.png', favicon)

    // Update tags in index.html
    const indexFile = await fs.readFile('public/index-template.html', 'utf8')
    const updatedIndexFile = indexFile
      .replace(/\$NAME/g, branding.siteName)
      .replace(/\$DESCRIPTION/g, branding.siteDescription)
      .replace(/\$IMAGE/g, branding.logo)
      .replace(/\$ANALYTICSID/g, settings.googleAnalyticsId)

    await fs.writeFile('public/index.html', updatedIndexFile)
    console.log('Customization config applied.')
  } catch (err) {
    console.log(`Could not create customization config: ${err}`)
  }
}

// Generate PNG copies of SVG icons for the purpose of KML export.
const svgIconsToPng = async () => {
  try {
    const files = await fs.readdir('src/locationIcons')
    const svgIconNames = files
      .filter(item => item.endsWith('.svg'))
      .map(item => item.replace('.svg', ''))
    await fs.rmdir('public/location-icons', { recursive: true })
    await fs.mkdir('public/location-icons')
    svgIconNames.forEach(async icon => {
      await sharp(`src/locationIcons/${icon}.svg`)
        .resize({ height: 30 })
        .toFile(`public/location-icons/${icon}.png`)
    })
    console.log('Generated PNG copies from SVG icons.')
  } catch (error) {
    console.log(`An error occurred during converting the SVG icons: ${error}`)
  }
}

applyConfig()
svgIconsToPng()
