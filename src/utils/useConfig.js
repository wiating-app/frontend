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
      const { data } = await axios.get('/wiating/config.json')
      let locationTypes = []
      await asyncForEach(data.locationTypes, async item => {
        const iconFile = await import(`./locationIcons/${item.iconId}.svg`)
        locationTypes = [...locationTypes, {
          ...item,
          icon: iconFile.default,
        }]
      })
      const parsedConfig = {
        ...data,
        locationTypes,
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
