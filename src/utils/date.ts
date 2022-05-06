export const isSameDay = (date1: Date, date2: Date) => {
  return date1.setHours(0,0,0,0) === date2.setHours(0,0,0,0);
}

export const convertTimestampToTimezone = (utcTimestampMs: number, timeZoneOffsetMs: number) => {
  return utcTimestampMs + timeZoneOffsetMs;
}



export const getCurrentDateWithTimeZoneOffset = (timeZoneOffsetMs: number) => {
  return new Date(convertTimestampToTimezone(new Date().getTime(), timeZoneOffsetMs))
}
