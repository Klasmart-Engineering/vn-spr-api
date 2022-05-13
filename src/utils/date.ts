export const isSameDay = (date1: Date, date2: Date) => {
  return date1.setHours(0, 0, 0, 0) === date2.setHours(0, 0, 0, 0);
};

export const dateDiff = (fromDate: Date, toDate: Date) => {
  return (toDate.getTime() - fromDate.getTime()) / (24 * 3600 * 1000);
};

export const addDays = (date: Date, days: number) => {
  return new Date(date.getTime() + days * 24 * 3600 * 1000);
};

export const subtractDate = (date: Date, days: number) => {
  return addDays(date, -days);
};

/**
 * Generate a list of dates from a specific day in descending order
 *
 * @param from
 * @param length number of dates will be generate, should be an integer
 * @param step should be an integer, can be a negative
 */
export const generateDates = (
  from: Date,
  length: number,
  step = 1
): string[] => {
  const dates = [from.toISOString().slice(0, 10)];

  const iStep = step | 0; // ensure it's an integer
  let iLength = length | 0; // ensure it's an integer
  const date = new Date(from);
  while (iLength > 1) {
    date.setDate(date.getDate() + iStep);
    dates.push(date.toISOString().slice(0, 10));
    iLength--;
  }

  return dates.sort().reverse();
};

/**
 * Generate a list of dates from a specific day in descending order
 *
 * @param from from the date want to start
 */
export const generateDatesForYear = (from: Date): string[] => {
  const dates = [from.toISOString().slice(0, 8) + '01'];
  let iLength = 12;
  const date = new Date(from);
  while (iLength > 1) {
    date.setMonth(date.getMonth() - 1);
    dates.push(date.toISOString().slice(0, 8) + '01');
    iLength--;
  }

  return dates.sort().reverse();
};

/**
 * Group scores with day information into date ranges
 *
 * @param dates list of date, must be in descending order
 * @param scoresWithDate dates must be in descending order
 */
export const groupScoresByDateRanges = (
  dates: string[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  scoresWithDate: Record<string, any>[]
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: Record<string, any> = [];

  let j = 0; // this help to iterate the scoresWithDate once
  for (let i = 0; i < dates.length; i++) {
    const compareDate = dates[i + 1] || '';

    result[dates[i]] = {
      name: dates[i],
      data: [],
    };

    for (j; j < scoresWithDate.length; ) {
      if (
        scoresWithDate[j].day > compareDate &&
        scoresWithDate[j].day <= dates[i]
      ) {
        result[dates[i]]['data'].push(scoresWithDate[j]);
        j++;
      } else {
        break;
      }
    }
  }

  return result;
};

/**
 * Group scores with the same month into date ranges
 *
 * @param dates list of date, must be in descending order
 * @param scoresWithDate dates must be in descending order
 */
export const groupScoresByDateRangesForYear = (
  dates: string[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  scoresWithDate: Record<string, any>[]
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: Record<string, any> = [];
  let j = 0;
  for (let i = 0; i < dates.length; i++) {
    result[dates[i]] = {
      name: dates[i],
      data: [],
    };

    for (j; j < scoresWithDate.length; ) {
      if (scoresWithDate[j].day.slice(0, 8) === dates[i].slice(0, 8)) {
        result[dates[i]]['data'].push(scoresWithDate[j]);
        j++;
      } else {
        break;
      }
    }
  }

  return result;
};
