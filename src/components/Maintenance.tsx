import React from 'react'
import useConfig from '../utils/useConfig'
import Heading from './Heading'
import Typography from './Typography'
import { Wrench } from 'lucide-react'

const Maintenance = () => {
  const {
    branding: { themeColor },
  } = useConfig()

  return (
    <div
      className="flex h-screen w-full flex-col items-center justify-center p-4"
      style={{ backgroundColor: themeColor }}
    >
      <div className="mx-auto max-w-2xl text-center">
        <div className="mb-8 flex justify-center">
          <div className="rounded-full bg-white/20 p-8 backdrop-blur-sm">
            <Wrench className="text-white" size={64} />
          </div>
        </div>

        <Heading level={2} className="mb-6 font-light text-white">
          Prace serwisowe
        </Heading>

        <Typography variant="body1" className="mb-8 text-lg leading-relaxed text-white/90">
          W serwisie Wiating trwają właśnie prace konserwacyjne. Przepraszamy za niedogodności.
        </Typography>

        <Typography variant="body2" className="text-white/75">
          Spróbuj ponownie później.
        </Typography>
      </div>
    </div>
  )
}

export default Maintenance
