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
// Returns the current time, possibly mocked via URL parameter ?mockDate=YYYY-MM-DDTHH:mm
export function getCurrentTime(): Date {
    if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const mockDateFunc = params.get('mockDate');
        if (mockDateFunc) {
            const parsed = new Date(mockDateFunc);
            if (!isNaN(parsed.getTime())) {
                return parsed;
            }
        }
    }
    return new Date();
}

export function isMockMode(): boolean {
    if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        return !!params.get('mockDate');
    }
    return false;
}

export function getNowJST(): Date {
    // Current approach uses system time but assumes it's JST or handled as JST in logic.
    // We replace the source of truth with getCurrentTime().
    return toZonedTime(getCurrentTime(), TIMEZONE);
}

/**
 * Formats a given date string (or Date object) into a string using JST timezone.
 */
export function formatJST(date: Date | string | number, fmt: string, options?: { locale?: Locale }): string {
    return formatInTimeZone(date, TIMEZONE, fmt, options);
}
