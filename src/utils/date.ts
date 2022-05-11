export const isSameDay = (date1: Date, date2: Date) => {
  return date1.setHours(0,0,0,0) === date2.setHours(0,0,0,0);
}

export const dateDiff = (fromDate: Date, toDate: Date) => {
  return (toDate.getTime() - fromDate.getTime()) / (24 * 3600 * 1000);
}

export const plusDate = (date: Date, days: number) => {
  return new Date(date.getTime() + days * 24 * 3600 * 1000);
}

export const subtractDate = (date: Date, days: number) => {
  return new Date(date.getTime() - days * 24 * 3600 * 1000);
}
