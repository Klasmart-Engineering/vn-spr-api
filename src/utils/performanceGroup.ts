import { GROUP_BELOW_THRESHOLD, GROUP_UPPER_THRESHOLD } from "src/config"

export const isAbove = (percent: number): boolean => {
  return percent >= GROUP_UPPER_THRESHOLD;
}

export const isMeets = (percent: number): boolean => {
  return percent >= GROUP_BELOW_THRESHOLD && percent < GROUP_UPPER_THRESHOLD;
}

export const isBelow = (percent: number): boolean => {
  return percent < GROUP_BELOW_THRESHOLD;
}
