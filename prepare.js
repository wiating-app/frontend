#!/usr/bin/env node
const fs = require('fs/promises')

const writeConfig = async () => {
  try {
    const config = await fs.readFile('public/wiating/config.json', 'utf8')
    await fs.writeFile('config.json', config)
  } catch (err) {
    throw new Error(err)
  }
}

writeConfig()
