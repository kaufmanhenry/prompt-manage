export function formatDateUTC(dateLike: string | number | Date): string {
  const d = new Date(dateLike)
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit', timeZone: 'UTC' }).format(d)
}

export function formatDateTimeUTC(dateLike: string | number | Date): string {
  const d = new Date(dateLike)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit',
    hour12: false, timeZone: 'UTC'
  }).format(d)
}


