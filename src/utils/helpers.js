export const roundLatLng = (number) => {
  return Math.round(number * 100000) / 100000
}

export const formatDate = (timeString, variant = 'short') => {
  const dateOptions = {
    short: { day: 'numeric', month: 'short', year: 'numeric' },
    verbal: { day: 'numeric', month: 'long', year: 'numeric' },
  }
  const formatedDate = new Date(timeString).toLocaleDateString(undefined, dateOptions[variant])
  return formatedDate === 'Invalid Date' ? timeString : formatedDate
}

export const formatTime = (timeString, variant = 'standard') => {
  const dateOptions = {
    standard: { hour: '2-digit', minute: '2-digit' },
    detailed: { hour: '2-digit', minute: '2-digit', second: '2-digit' },
  }
  const formatedDate = new Date(timeString).toLocaleTimeString(undefined, dateOptions[variant])
  return formatedDate === 'Invalid Date' ? timeString : formatedDate
}

export const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}
