import React from 'react'
import Modal from './Modal'
import Button from './Button'
import Loader from './Loader'
import FormActions from './Inputs/FormActions'
import { WrappedStats } from '../typings'
import useConfig from '../utils/useConfig'
import { Activity, MapPin, Camera, Edit, Award, Map } from 'lucide-react'

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
  const positions: Array<{ top: number; left: number; rotation: number }> = []

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
        const distance = Math.sqrt(
          Math.pow(top - pos.top, 2) + Math.pow(left - pos.left, 2)
        )
        return distance >= minDistance
      })

      attempts++
    }

    positions.push({
      top,
      left,
      rotation: Math.random() * 360,
    })
  }

  return positions
}

const Wrapped = ({ stats, isLoading, isError, onClose, onShowLocation, onViewLocation, locationName, isLoadingLocation }: WrappedProps) => {
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
    <Modal onClose={onClose} short wide id='cy-wrapped'>
      {isLoading && <Loader big dark centered />}
      {isError && (
        <div className="text-center py-8">
          <div className="text-red-600">Nie udało się załadować statystyk.</div>
        </div>
      )}
      {stats && !isLoading && !isError && (
        <>
          <div className="space-y-2">
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-2 text-gray-900">Twój rok {stats.year} w Wiating</h2>
              <p className="text-gray-700 text-base">Podsumowanie Twojej aktywności</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {/* Total Actions */}
              <div
                className="relative rounded-lg p-5 border-2 border-gray-200 shadow-lg overflow-hidden"
                style={{ backgroundColor: themeColor }}
              >
                {totalActionsIcons.map((pos, idx) => (
                  <Activity
                    key={idx}
                    size={70}
                    className="absolute opacity-10 text-white"
                    style={{
                      top: `${pos.top}%`,
                      left: `${pos.left}%`,
                      transform: `translate(-50%, -50%) rotate(${pos.rotation}deg)`,
                    }}
                  />
                ))}
                <div className="relative z-10 text-center">
                  <div className="text-sm text-white/90 font-medium mb-2">Wszystkie akcje</div>
                  <div className="text-5xl font-bold text-white mb-1">{stats.user_total}</div>
                  <div className="text-xs text-white/80">akcji w {stats.year} roku</div>
                </div>
              </div>

              {/* Locations Created */}
              <div
                className="relative rounded-lg p-5 border-2 border-gray-200 shadow-lg overflow-hidden"
                style={{ backgroundColor: secondaryColor }}
              >
                {locationsCreatedIcons.map((pos, idx) => (
                  <MapPin
                    key={idx}
                    size={70}
                    className="absolute opacity-10 text-white"
                    style={{
                      top: `${pos.top}%`,
                      left: `${pos.left}%`,
                      transform: `translate(-50%, -50%) rotate(${pos.rotation}deg)`,
                    }}
                  />
                ))}
                <div className="relative z-10 text-center">
                  <div className="text-sm text-white/90 font-medium mb-2">Utworzone lokacje</div>
                  <div className="text-5xl font-bold text-white mb-1">{stats.user_created}</div>
                  <div className="text-xs text-white/80">nowych miejsc</div>
                </div>
              </div>

              {/* Images Added */}
              <div
                className="relative rounded-lg p-5 border-2 border-gray-200 shadow-lg overflow-hidden"
                style={{ backgroundColor: themeColor }}
              >
                {imagesAddedIcons.map((pos, idx) => (
                  <Camera
                    key={idx}
                    size={70}
                    className="absolute opacity-10 text-white"
                    style={{
                      top: `${pos.top}%`,
                      left: `${pos.left}%`,
                      transform: `translate(-50%, -50%) rotate(${pos.rotation}deg)`,
                    }}
                  />
                ))}
                <div className="relative z-10 text-center">
                  <div className="text-sm text-white/90 font-medium mb-2">Dodane zdjęcia</div>
                  <div className="text-5xl font-bold text-white mb-1">{stats.user_images}</div>
                  <div className="text-xs text-white/80">zdjęć dodanych</div>
                </div>
              </div>

              {/* Edits Made */}
              <div
                className="relative rounded-lg p-5 border-2 border-gray-200 shadow-lg overflow-hidden"
                style={{ backgroundColor: secondaryColor }}
              >
                {editsMadeIcons.map((pos, idx) => (
                  <Edit
                    key={idx}
                    size={70}
                    className="absolute opacity-10 text-white"
                    style={{
                      top: `${pos.top}%`,
                      left: `${pos.left}%`,
                      transform: `translate(-50%, -50%) rotate(${pos.rotation}deg)`,
                    }}
                  />
                ))}
                <div className="relative z-10 text-center">
                  <div className="text-sm text-white/90 font-medium mb-2">Wprowadzone edycje</div>
                  <div className="text-5xl font-bold text-white mb-1">{stats.user_edits}</div>
                  <div className="text-xs text-white/80">zmian w lokacjach</div>
                </div>
              </div>
            </div>

            {/* Activity Percentage */}
            <div
              className="relative rounded-lg p-6 border-2 border-gray-200 shadow-lg overflow-hidden text-center"
              style={{ backgroundColor: themeColor }}
            >
              {activityPercentageIcons.map((pos, idx) => (
                <Award
                  key={idx}
                  size={100}
                  className="absolute opacity-10 text-white"
                  style={{
                    top: `${pos.top}%`,
                    left: `${pos.left}%`,
                    transform: `translate(-50%, -50%) rotate(${pos.rotation}deg)`,
                  }}
                />
              ))}
              <div className="relative z-10">
                <div className="text-base text-white/90 font-medium mb-2">Twoja pozycja</div>
                <div className="text-6xl font-bold text-white mb-2">{activityPercentage}%</div>
                <div className="text-base text-white/80">najaktywniejszych użytkowników</div>
              </div>
            </div>

            {/* Top Location */}
            {stats.user_top_loc && (
              <div
                className="relative rounded-lg p-6 border-2 border-gray-200 shadow-lg overflow-hidden"
                style={{ backgroundColor: secondaryColor }}
              >
                {topLocationIcons.map((pos, idx) => (
                  <Map
                    key={idx}
                    size={100}
                    className="absolute opacity-10 text-white"
                    style={{
                      top: `${pos.top}%`,
                      left: `${pos.left}%`,
                      transform: `translate(-50%, -50%) rotate(${pos.rotation}deg)`,
                    }}
                  />
                ))}
                <div className="relative z-10 text-center">
                  <div className="text-base text-white/90 font-medium mb-3">Najczęściej edytowana lokacja</div>
                  {locationName
                    ? (
                        <div className="space-y-3">
                          <div className="text-2xl font-bold text-white">{locationName}</div>
                          <Button
                            variant="default"
                            size="medium"
                            onClick={onViewLocation}
                            disabled={!onViewLocation}
                            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                          >
                            Zobacz
                          </Button>
                        </div>
                      )
                    : isLoadingLocation
                      ? (
                          <Loader centered />
                        )
                      : (
                          <Button
                            variant="default"
                            size="medium"
                            onClick={onShowLocation}
                            disabled={!onShowLocation}
                          >
                            Sprawdź
                          </Button>
                        )}
                </div>
              </div>
            )}
          </div>
          <FormActions align='center'>
            <Button
              size='large'
              variant='primary'
              onClick={onClose}
            >
              Zamknij
            </Button>
          </FormActions>
        </>
      )}
    </Modal>
  )
}

export default Wrapped
