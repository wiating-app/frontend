import React from 'react'
import axios from 'axios'
import { Config } from '../typings'

export const ConfigContext = React.createContext<Config | null>(null)

interface ConfigProviderProps {
  children: React.ReactNode
}

export const ConfigProvider = ({ children }: ConfigProviderProps) => {
  const [config, setConfig] = React.useState<Config | null>(null)

  React.useEffect(() => {
    const asyncForEach = async (array: any[], callback: (item: any, index: number, array: any[]) => Promise<void>) => {
      for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
      }
    }

    const handleAsync = async () => {
      const customizationApi = axios.create({
        baseURL: process.env.CUSTOMIZATION_URL,
        timeout: 10000,
      })

      const { data: config } = await customizationApi.get<Config>('/customization.json')
      // Inject svg icons into location types.
      let locationTypes: any[] = []
      await asyncForEach(config.locationTypes, async (item: any) => {
        const iconFile = await import(`../locationIcons/${item.iconId}.svg`)
        locationTypes = [...locationTypes, {
          ...item,
          icon: iconFile.default,
        }]
      })

      // Load regulations and privacy policy content.
      const { data: termsAndConditions } = await customizationApi.get<string>(config.termsAndConditions)
      const { data: privacyPolicy } = await customizationApi.get<string>(config.privacyPolicy)
      const parsedConfig: Config = {
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

const useConfig = (): Config | null => {
  const config = React.useContext(ConfigContext)
  return config
}

export default useConfig
