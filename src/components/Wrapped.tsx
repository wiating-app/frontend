import React from 'react'
import { Activity, Award, Camera, Edit, Map, MapPin } from 'lucide-react'
import { WrappedStats } from '../typings'
import useConfig from '../utils/useConfig'
import Button from './Button'
import FormActions from './Inputs/FormActions'
import Loader from './Loader'
import Modal from './Modal'
import Typography from './Typography'

interface WrappedProps {
  stats: WrappedStats | null
  isLoading: boolean
  isError: boolean
  onClose: () => void
  onShowLocation?: () => void
  onViewLocation?: () => void
  locationName?: string
  isLoadingLocation?: boolean
}

// Helper function to generate random icon positions and rotations with minimum distance to prevent overlap
const generateIconPositions = (count: number, minDistance: number = 25) => {
  const positions: Array<{ top: number; left: number; rotation: number; size: number }> = []
  const iconSizes = [70, 90]

  for (let i = 0; i < count; i++) {
    let attempts = 0
    let validPosition = false
    let top = 0
    let left = 0

    while (!validPosition && attempts < 50) {
      top = Math.random() * 100
      left = Math.random() * 100

      // Check if this position is far enough from existing positions
      validPosition = positions.every(pos => {
        const distance = Math.sqrt(Math.pow(top - pos.top, 2) + Math.pow(left - pos.left, 2))
        return distance >= minDistance
      })

      attempts++
    }

    positions.push({
      top,
      left,
      rotation: Math.random() * 360,
      size: iconSizes[Math.floor(Math.random() * iconSizes.length)],
    })
  }

  return positions
}

const Wrapped = ({
  stats,
  isLoading,
  isError,
  onClose,
  onShowLocation,
  onViewLocation,
  locationName,
  isLoadingLocation,
}: WrappedProps) => {
  const activityPercentage = stats ? Math.round(stats.activity_percentage * 100) : 0
  const config = useConfig()
  const themeColor = config?.branding?.themeColor || '#4c4c42'
  const secondaryColor = config?.branding?.secondaryColor || themeColor

  // Generate random icon positions for each tile on each render (3 icons per tile, 4 for activity)
  const totalActionsIcons = React.useMemo(() => generateIconPositions(3), [])
  const locationsCreatedIcons = React.useMemo(() => generateIconPositions(3), [])
  const imagesAddedIcons = React.useMemo(() => generateIconPositions(3), [])
  const editsMadeIcons = React.useMemo(() => generateIconPositions(3), [])
  const activityPercentageIcons = React.useMemo(() => generateIconPositions(4), [])
  const topLocationIcons = React.useMemo(() => generateIconPositions(3), [])

  return (
    <Modal onClose={onClose} short wide id="cy-wrapped">
      {isLoading && <Loader big dark centered />}
      {isError && (
        <Typography className="text-center">
          Chcieliśmy pokazać Ci Twoje roczne statystyki, ale coś poszło nie tak. Spróbuj ponownie później.
        </Typography>
      )}
      {stats && !isLoading && !isError && (
        <>
          <div className="space-y-2">
            <div className="text-center">
              <h2 className="mb-1 text-4xl font-bold text-gray-900">Twój rok {stats.year} w Wiating</h2>
              <p className="pb-1 text-base text-gray-600">Podsumowanie Twojej aktywności</p>
            </div>

            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {/* Total Actions */}
              <div
                className="relative overflow-hidden rounded-lg border-2 border-gray-200 p-5 shadow-lg"
                style={{ backgroundColor: themeColor }}
              >
                {totalActionsIcons.map((pos, idx) => (
                  <Activity
                    key={idx}
                    size={pos.size}
                    className="absolute text-white opacity-10"
                    style={{
                      top: `${pos.top}%`,
                      left: `${pos.left}%`,
                      transform: `translate(-50%, -50%) rotate(${pos.rotation}deg)`,
                    }}
                  />
                ))}
                <div className="relative z-10 text-center">
                  <div className="mb-2 text-sm font-medium text-white/90">Wszystkie akcje</div>
                  <div className="mb-1 text-5xl font-bold text-white">{stats.user_total}</div>
                  <div className="text-xs text-white/80">akcji w {stats.year} roku</div>
                </div>
              </div>

              {/* Locations Created */}
              <div
                className="relative overflow-hidden rounded-lg border-2 border-gray-200 p-5 shadow-lg"
                style={{ backgroundColor: secondaryColor }}
              >
                {locationsCreatedIcons.map((pos, idx) => (
                  <MapPin
                    key={idx}
                    size={pos.size}
                    className="absolute text-white opacity-10"
                    style={{
                      top: `${pos.top}%`,
                      left: `${pos.left}%`,
                      transform: `translate(-50%, -50%) rotate(${pos.rotation}deg)`,
                    }}
                  />
                ))}
                <div className="relative z-10 text-center">
                  <div className="mb-2 text-sm font-medium text-white/90">Utworzone lokacje</div>
                  <div className="mb-1 text-5xl font-bold text-white">{stats.user_created}</div>
                  <div className="text-xs text-white/80">nowych miejsc</div>
                </div>
              </div>

              {/* Images Added */}
              <div
                className="relative overflow-hidden rounded-lg border-2 border-gray-200 p-5 shadow-lg"
                style={{ backgroundColor: themeColor }}
              >
                {imagesAddedIcons.map((pos, idx) => (
                  <Camera
                    key={idx}
                    size={pos.size}
                    className="absolute text-white opacity-10"
                    style={{
                      top: `${pos.top}%`,
                      left: `${pos.left}%`,
                      transform: `translate(-50%, -50%) rotate(${pos.rotation}deg)`,
                    }}
                  />
                ))}
                <div className="relative z-10 text-center">
                  <div className="mb-2 text-sm font-medium text-white/90">Dodane zdjęcia</div>
                  <div className="mb-1 text-5xl font-bold text-white">{stats.user_images}</div>
                  <div className="text-xs text-white/80">zdjęć dodanych</div>
                </div>
              </div>

              {/* Edits Made */}
              <div
                className="relative overflow-hidden rounded-lg border-2 border-gray-200 p-5 shadow-lg"
                style={{ backgroundColor: secondaryColor }}
              >
                {editsMadeIcons.map((pos, idx) => (
                  <Edit
                    key={idx}
                    size={pos.size}
                    className="absolute text-white opacity-10"
                    style={{
                      top: `${pos.top}%`,
                      left: `${pos.left}%`,
                      transform: `translate(-50%, -50%) rotate(${pos.rotation}deg)`,
                    }}
                  />
                ))}
                <div className="relative z-10 text-center">
                  <div className="mb-2 text-sm font-medium text-white/90">Wprowadzone edycje</div>
                  <div className="mb-1 text-5xl font-bold text-white">{stats.user_edits}</div>
                  <div className="text-xs text-white/80">zmian w lokacjach</div>
                </div>
              </div>
            </div>

            {/* Activity Percentage */}
            <div
              className="relative overflow-hidden rounded-lg border-2 border-gray-200 p-6 text-center shadow-lg"
              style={{ backgroundColor: themeColor }}
            >
              {activityPercentageIcons.map((pos, idx) => (
                <Award
                  key={idx}
                  size={pos.size}
                  className="absolute text-white opacity-10"
                  style={{
                    top: `${pos.top}%`,
                    left: `${pos.left}%`,
                    transform: `translate(-50%, -50%) rotate(${pos.rotation}deg)`,
                  }}
                />
              ))}
              <div className="relative z-10">
                <div className="mb-2 text-base font-medium text-white/90">Twoja pozycja</div>
                <div className="mb-2 text-6xl font-bold text-white">{activityPercentage}%</div>
                <div className="text-base text-white/80">najaktywniejszych użytkowników</div>
              </div>
            </div>

            {/* Top Location */}
            {stats.user_top_loc && (
              <div
                className="relative overflow-hidden rounded-lg border-2 border-gray-200 p-6 shadow-lg"
                style={{ backgroundColor: secondaryColor }}
              >
                {topLocationIcons.map((pos, idx) => (
                  <Map
                    key={idx}
                    size={pos.size}
                    className="absolute text-white opacity-10"
                    style={{
                      top: `${pos.top}%`,
                      left: `${pos.left}%`,
                      transform: `translate(-50%, -50%) rotate(${pos.rotation}deg)`,
                    }}
                  />
                ))}
                <div className="relative z-10 text-center">
                  <div className="mb-3 text-base font-medium text-white/90">Najczęściej edytowana lokacja</div>
                  {locationName ? (
                    <div className="space-y-3">
                      <div className="text-2xl font-bold text-white">{locationName}</div>
                      <Button
                        variant="default"
                        size="medium"
                        onClick={onViewLocation}
                        disabled={!onViewLocation}
                        className="border-white/30 bg-white/20 text-white hover:bg-white/30"
                      >
                        Zobacz
                      </Button>
                    </div>
                  ) : isLoadingLocation ? (
                    <Loader centered />
                  ) : (
                    <Button variant="default" size="medium" onClick={onShowLocation} disabled={!onShowLocation}>
                      Sprawdź
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
          <FormActions align="center" className="sm:hidden">
            <Button size="large" variant="primary" onClick={onClose}>
              Zamknij
            </Button>
          </FormActions>
        </>
      )}
    </Modal>
  )
}

export default Wrapped
