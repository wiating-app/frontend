import React from 'react'
import Modal from './Modal'
import Button from './Button'
import Loader from './Loader'
import FormActions from './Inputs/FormActions'
import { WrappedStats } from '../typings'

interface WrappedProps {
  stats: WrappedStats | null
  loading: boolean
  error: string | null
  onClose: () => void
}

const Wrapped = ({ stats, loading, error, onClose }: WrappedProps) => {
  const activityPercentage = stats ? Math.round(stats.activity_percentage * 100) : 0

  return (
    <Modal onClose={onClose} short id='cy-wrapped'>
      {loading && (
        <div className="flex justify-center items-center py-8">
          <Loader big />
        </div>
      )}
      {error && (
        <div className="text-center py-8">
          <div className="text-red-600">{error}</div>
        </div>
      )}
      {stats && !loading && !error && (
        <>
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-2">Twój rok {stats.year} w Wiating</h2>
              <p className="text-gray-600">Podsumowanie Twojej aktywności</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Total Actions */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
                <div className="text-sm text-blue-700 font-medium mb-2">Wszystkie akcje</div>
                <div className="text-4xl font-bold text-blue-900">{stats.user_total}</div>
                <div className="text-xs text-blue-600 mt-1">akcji w {stats.year} roku</div>
              </div>

              {/* Locations Created */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
                <div className="text-sm text-green-700 font-medium mb-2">Utworzone lokacje</div>
                <div className="text-4xl font-bold text-green-900">{stats.user_created}</div>
                <div className="text-xs text-green-600 mt-1">nowych miejsc</div>
              </div>

              {/* Images Added */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
                <div className="text-sm text-purple-700 font-medium mb-2">Dodane zdjęcia</div>
                <div className="text-4xl font-bold text-purple-900">{stats.user_images}</div>
                <div className="text-xs text-purple-600 mt-1">zdjęć dodanych</div>
              </div>

              {/* Edits Made */}
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
                <div className="text-sm text-orange-700 font-medium mb-2">Wprowadzone edycje</div>
                <div className="text-4xl font-bold text-orange-900">{stats.user_edits}</div>
                <div className="text-xs text-orange-600 mt-1">zmian w lokacjach</div>
              </div>
            </div>

            {/* Activity Percentage */}
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-6 border border-indigo-200 text-center">
              <div className="text-sm text-indigo-700 font-medium mb-2">Twoja pozycja</div>
              <div className="text-5xl font-bold text-indigo-900 mb-2">{activityPercentage}%</div>
              <div className="text-sm text-indigo-600">najaktywniejszych użytkowników</div>
            </div>
          </div>
          <FormActions>
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
