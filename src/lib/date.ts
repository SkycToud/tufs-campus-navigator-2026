import { toZonedTime, formatInTimeZone } from 'date-fns-tz';
import { type Locale } from 'date-fns';

export const TIMEZONE = 'Asia/Tokyo';

/**
 * Returns the current time as a Date object converted to JST timezone.
 * Note: The Date object itself still carries the underlying timestamp, 
 * but if you use getHours() on it in a different locale it might be confusing.
 * 
 * Best practice: Use this "zoned" date primarily for extracting components 
 * assuming the environment is now "in" that timezone, or use formatJST.
 */
export function getNowJST(): Date {
    return toZonedTime(new Date(), TIMEZONE);
}

/**
 * Formats a given date string (or Date object) into a string using JST timezone.
 */
export function formatJST(date: Date | string | number, fmt: string, options?: { locale?: Locale }): string {
    return formatInTimeZone(date, TIMEZONE, fmt, options);
}
