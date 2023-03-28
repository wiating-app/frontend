import React from 'react'
import axios from 'axios'

export const ConfigContext = React.createContext(null)

export const ConfigProvider = ({ children }) => {
  const [config, setConfig] = React.useState(null)

  React.useEffect(() => {
    const asyncForEach = async (array, callback) => {
      for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
      }
    }

    const handleAsync = async () => {
      const { data: config } = await axios.get('/wiating/customization.json')
      // Inject svg icons into location types.
      let locationTypes = []
      await asyncForEach(config.locationTypes, async item => {
        const iconFile = await import(`../locationIcons/${item.iconId}.svg`)
        locationTypes = [...locationTypes, {
          ...item,
          icon: iconFile.default,
        }]
      })
      // Load regulations and privacy policy content.
      const { data: termsAndConditions } = await axios.get(config.termsAndConditions)
      const { data: privacyPolicy } = await axios.get(config.privacyPolicy)
      const parsedConfig = {
        ...config,
        locationTypes,
        termsAndConditions,
        privacyPolicy,
      }
      setConfig(parsedConfig)
    }
    handleAsync()
  }, [])

  return (
    <ConfigContext.Provider value={config}>
      {config && children}
    </ConfigContext.Provider>
  )
}

const useConfig = () => {
  const config = React.useContext(ConfigContext)
  return config
}

export default useConfig
