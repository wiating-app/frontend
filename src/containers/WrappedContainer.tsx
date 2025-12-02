import React from 'react'
import Wrapped from '../components/Wrapped'
import { getWrapped } from '../api/getWrapped'
import { WrappedStats } from '../typings'
import useLanguage from '../utils/useLanguage'
import useAuth0 from '../utils/useAuth0'

const WrappedContainer = () => {
  const { shouldSeeWrapped } = useAuth0()
  const [stats, setStats] = React.useState<WrappedStats | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const { translations } = useLanguage()

  React.useEffect(() => {
    if (!shouldSeeWrapped) {
      return
    }
    const fetchStats = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getWrapped()
        setStats(data)
      } catch (err: any) {
        const errorMessage = err?.response?.data?.message || translations?.connectionProblemLogs || 'Nie udało się załadować statystyk.'
        setError(errorMessage)
        console.error('Failed to fetch wrapped stats:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [translations, shouldSeeWrapped])

  if (!shouldSeeWrapped) {
    return null
  }

  const handleClose = () => {
    if (stats) {
      const dismissedKey = `wrappedDismissed_${stats.year}`
      localStorage.setItem(dismissedKey, 'true')
    }
  }

  return (
    <Wrapped
      stats={stats}
      loading={loading}
      error={error}
      onClose={handleClose}
    />
  )
}

export default WrappedContainer
