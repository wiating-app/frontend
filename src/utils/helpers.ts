export const roundLatLng = (number: number): number => {
  return Math.round(number * 100000) / 100000
}

type DateVariant = 'short' | 'verbal'

export const formatDate = (timeString: string | number | Date, variant: DateVariant = 'short'): string => {
  const dateOptions: Record<DateVariant, Intl.DateTimeFormatOptions> = {
    short: { day: 'numeric', month: 'short', year: 'numeric' },
    verbal: { day: 'numeric', month: 'long', year: 'numeric' },
  }
  const formatedDate = new Date(timeString).toLocaleDateString(undefined, dateOptions[variant])
  return formatedDate === 'Invalid Date' ? String(timeString) : formatedDate
}

type TimeVariant = 'standard' | 'detailed'

export const formatTime = (timeString: string | number | Date, variant: TimeVariant = 'standard'): string => {
  const dateOptions: Record<TimeVariant, Intl.DateTimeFormatOptions> = {
    standard: { hour: '2-digit', minute: '2-digit' },
    detailed: { hour: '2-digit', minute: '2-digit', second: '2-digit' },
  }
  const formatedDate = new Date(timeString).toLocaleTimeString(undefined, dateOptions[variant])
  return formatedDate === 'Invalid Date' ? String(timeString) : formatedDate
}

export const asyncForEach = async <T>(
  array: T[],
  callback: (item: T, index: number, array: T[]) => Promise<void>
): Promise<void> => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

export const locationToString = ({ lat, lng }: { lat: number; lng: number }): string => {
  return [lat, lng].toString().replace(',', ', ')
}
