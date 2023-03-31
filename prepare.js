#!/usr/bin/env node
const fsSync = require('fs')
const fs = require('fs/promises')
const axios = require('axios')
const sharp = require('sharp')
require('dotenv').config()

const applyConfig = async () => {
  try {
    const customizationApi = axios.create({
      baseURL: process.env.CUSTOMIZATION_URL,
      timeout: 10000,
    })

    // Read config
    const { data: config } = await customizationApi.get('customization.json')
    await fs.writeFile('customization.json', JSON.stringify(config))
    const { branding, settings } = config

    // Get favicon source
    const { data } = await customizationApi.get('favicon.png', {
      responseType: 'stream',
    })
    data.pipe(fsSync.createWriteStream('public/favicon.png'));

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
