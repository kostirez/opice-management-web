import { DayInWeek } from '../models';

/**
 * Returns the current day of the week in DayInWeek format:
 * MON, TUE, WED, THU, FRI, SAT, SUN
 */
export function getCurrentDayInWeek(): DayInWeek {
  const days: DayInWeek[] = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const todayIndex = new Date().getDay();
  return days[todayIndex];
}
