import { config } from 'dotenv';

config();

export const SPS_INTERVAL_IN_DAYS = parseInt(
  process.env.SPS_INTERVAL_IN_DAYS || '7'
);

export const GROUP_BELOW_THRESHOLD = parseFloat(
  process.env.BELOW_THRESHOLD || '50'
);

export const GROUP_UPPER_THRESHOLD = parseFloat(
  process.env.UPPER_THRESHOLD || '75'
);
