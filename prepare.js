#!/usr/bin/env node
const fs = require('fs/promises')
require('dotenv').config()

const writeConfig = async () => {
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
  } catch (err) {
    throw new Error(err)
  }
}

writeConfig()
