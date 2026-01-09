import { addDays, isSameDay, parseISO } from 'date-fns';
import { formatJST } from '../lib/date';
import { SCHEDULES } from '../lib/schedules';

export interface GlobalAlert {
    id: string;
    message: string;
    type: 'info' | 'warning' | 'urgent';
}

export function useGlobalAlerts(date: Date = new Date()): GlobalAlert[] {
    const alerts: GlobalAlert[] = [];
    const tomorrow = addDays(date, 1);

    // Check Library Special Closures for Tomorrow
    const libraryRules = SCHEDULES['library'];
    const tomorrowClosedRule = libraryRules.find(r =>
        r.isClosed &&
        r.type === 'specific_date' &&
        r.dates?.some(d => isSameDay(parseISO(d), tomorrow))
    );

    if (tomorrowClosedRule) {
        alerts.push({
            id: 'lib-closed-tmr',
            message: `明日 (${formatJST(tomorrow, 'M/d')}) は図書館が休館日です: ${tomorrowClosedRule.note}`,
            type: 'warning'
        });
    }

    // Check Accounting Cash Alert (If today is weekday and time is approaching 15:00)
    // This is handled in per-facility status mostly, but could be global if urgent.

    // Example: End of Month Alert
    if (isSameDay(tomorrow, new Date('2026-01-31'))) {
        alerts.push({
            id: 'eom-closed',
            message: '明日は月末休館日です。',
            type: 'warning'
        });
    }

    return alerts;
}
