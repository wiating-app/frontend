import React from 'react'
import Heading from './Heading'
import Typography from './Typography'
import { Wrench } from 'lucide-react'
import useConfig from '../utils/useConfig'

const Maintenance = () => {
  const { branding: { themeColor } } = useConfig()

  return (
    <div
      className="flex flex-col items-center justify-center w-full h-screen p-4"
      style={{ backgroundColor: themeColor }}
    >
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8 flex justify-center">
          <div className="bg-white/20 rounded-full p-8 backdrop-blur-sm">
            <Wrench className="text-white" size={64} />
          </div>
        </div>

        <Heading level={2} className="mb-6 text-white font-light">
          Prace serwisowe
        </Heading>

        <Typography variant="body1" className="mb-8 text-white/90 text-lg leading-relaxed">
          W serwisie Wiating trwają właśnie prace konserwacyjne.
          Przepraszamy za niedogodności.
        </Typography>

        <Typography variant="body2" className="text-white/75">
          Spróbuj ponownie później.
        </Typography>
      </div>
    </div>
  )
}

export default Maintenance
