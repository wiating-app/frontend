export const roundLatLng = (number) => {
  return Math.round(number * 100000) / 100000
}

export const formatDate = (timestamp, variant = 'short') => {
  const dateOptions = {
    short: { day: 'numeric', month: 'short', year: 'numeric' },
    verbal: { day: 'numeric', month: 'long', year: 'numeric' },
  }
  const formatedDate = new Date(timestamp).toLocaleDateString(undefined, dateOptions[variant])
  return formatedDate === 'Invalid Date' ? timestamp : formatedDate
}

export const formatTime = (timestamp, variant = 'standard') => {
  const dateOptions = {
    standard: { hour: '2-digit', minute: '2-digit' },
    detailed: { hour: '2-digit', minute: '2-digit', second: '2-digit' },
  }
  const formatedDate = new Date(timestamp).toLocaleTimeString(undefined, dateOptions[variant])
  return formatedDate === 'Invalid Date' ? timestamp : formatedDate
}
