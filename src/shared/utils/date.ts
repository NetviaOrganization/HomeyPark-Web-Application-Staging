export const formatDate = (date: Date | string): string => {
  const d = new Date(date)
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(d)
}

export const formatDateWithTime = (date: Date | string): string => {
  const d = new Date(date)
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(d)
}
