// Numbers shown in the Live Results bar under the home hero. These are sample
// figures for now: replace each `value` with real client totals when you have them.
// `tick` is how much the number can grow every few seconds after it counts up,
// so the bar feels live; set it to 0 for numbers that shouldn't move.

export type ResultFormat = 'plus' | 'compact' | 'seconds';

export interface LiveResult {
  key: 'followers' | 'views' | 'leads' | 'reply';
  value: number;
  format: ResultFormat;
  tick: number;
}

export const LIVE_RESULTS: LiveResult[] = [
  { key: 'followers', value: 38_400, format: 'plus', tick: 3 },
  { key: 'views', value: 1_200_000, format: 'compact', tick: 0 },
  { key: 'leads', value: 4_100, format: 'plus', tick: 1 },
  { key: 'reply', value: 14, format: 'seconds', tick: 0 },
];
