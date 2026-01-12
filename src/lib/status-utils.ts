import { isSameDay, parseISO, isWithinInterval, getDay, format } from 'date-fns';
import { CONST_SCHEDULE_DATA, type FacilityId, type ScheduleRule } from './schedules';
import { formatJST } from './date';
import * as holiday_jp from 'holiday-jp';

export type FacilityStatus = 'open' | 'closed' | 'break' | 'closing_soon';

export interface StatusResult {
    status: FacilityStatus;
    statusText: string;
    nextChangeText: string;
    alert?: string;
    isOpen: boolean;
    // Removed 'hours' property from interface as it's not standard StatusResult, but AdminBuildingCard was using it. 
    // I should add it back if I want to keep compatibility or fix AdminBuildingCard. 
    // AdminBuildingCard uses { status, hours, statusText }.
    hours?: { start: string; end: string };
}

export function calculateFacilityStatus(
    facilityId: FacilityId,
    date: Date,
    now: Date,
    t: (key: string) => string,
    isMaintenanceMode: boolean
): StatusResult {
    // 0. CHECK MAINTENANCE MODE
    if (isMaintenanceMode) {
        return {
            status: 'closed',
            statusText: 'Maintenance',
            nextChangeText: 'Under maintenance',
            isOpen: false,
            alert: 'System Maintenance',
        };
    }

    const nowJST = now;
    const dateJSTStr = formatJST(date, 'yyyy-MM-dd');
    const facilityData = CONST_SCHEDULE_DATA[facilityId];

    // 1. CHECK EXCEPTIONS
    if (facilityData.exceptions && facilityData.exceptions[dateJSTStr]) {
        const exception = facilityData.exceptions[dateJSTStr];
        if (exception.status === 'closed') {
            return {
                status: 'closed',
                statusText: exception.reason || t('status.closed'),
                nextChangeText: 'Exceptional Closure',
                isOpen: false,
                alert: exception.reason
            };
        }
    }

    const isToday = isSameDay(date, nowJST);
    const dayOfWeek = getDay(date); // 0=Sun, 1=Mon...
    const rules = facilityData.rules;

    // 2. Find matching rule
    let matchedRule: ScheduleRule | undefined;

    // Priority 1: Specific Date
    matchedRule = rules.find(r => r.type === 'specific_date' && r.dates?.some(d => isSameDay(parseISO(d), date)));

    // Priority 2: National Holiday (Dynamic)
    if (!matchedRule) {
        const isHoliday = holiday_jp.isHoliday(date);
        if (isHoliday) {
            matchedRule = rules.find(r => r.type === 'national_holiday');
            // If found, use it. Usually national_holiday rule implies closed, but could be open if configured.
            // If the rule says 'isClosed: true', it will be handled below.
            // If no national_holiday rule exists for this facility, we continue to standard weekday/range checks.
            // However, explicit 'national_holiday' rule takes precedence over range/weekday.

            // IMPORTANT: If matchedRule is generic "national_holiday", we probably want to append the holiday name
            if (matchedRule) {
                // Clone to avoid mutating const, and add holiday name to note if missing
                const holidayName = holiday_jp.between(date, date)[0]?.name || '祝日';
                matchedRule = { ...matchedRule, note: matchedRule.note === '祝日' ? holidayName : matchedRule.note };
            }
        }
    }

    // Priority 3: Range
    if (!matchedRule) {
        matchedRule = rules.find(r => r.type === 'range' && r.startDate && r.endDate &&
            isWithinInterval(date, { start: parseISO(r.startDate), end: parseISO(r.endDate) })
        );
    }

    // Priority 4: Day of week
    if (!matchedRule) {
        if (dayOfWeek === 0) matchedRule = rules.find(r => r.type === 'sunday');
        else if (dayOfWeek === 6) matchedRule = rules.find(r => r.type === 'saturday');
        else matchedRule = rules.find(r => r.type === 'weekday');
    }

    // Default to closed if no rule found
    if (!matchedRule || matchedRule.isClosed) {
        return {
            status: 'closed',
            statusText: matchedRule?.note || t('status.closed'),
            nextChangeText: 'Next: Check Calendar',
            isOpen: false,
            alert: matchedRule?.note
        };
    }

    // If it's a future date, just show hours
    if (!isToday) {
        const hoursText = matchedRule.hours.map(h => `${h.start}-${h.end}`).join(', ');
        return {
            status: 'closed', // Technically closed right now relative to the user, but open on that day
            statusText: hoursText || t('status.closed'),
            nextChangeText: '',
            isOpen: false,
            alert: matchedRule.note,
            hours: matchedRule.hours[0] // Add hours for AdminBuildingCard compatibility
        };
    }

    // It is TODAY. Check time.
    const currentTimeStr = formatJST(now, 'HH:mm');

    // Check if within any open range
    let currentRange = matchedRule.hours.find(h => currentTimeStr >= h.start && currentTimeStr < h.end);

    // Check if break (between two ranges)
    let isBreak = false;
    let nextOpenStart = '';
    if (!currentRange && matchedRule.hours.length > 1) {
        for (let i = 0; i < matchedRule.hours.length - 1; i++) {
            if (currentTimeStr >= matchedRule.hours[i].end && currentTimeStr < matchedRule.hours[i + 1].start) {
                isBreak = true;
                nextOpenStart = matchedRule.hours[i + 1].start;
                break;
            }
        }
    }

    if (currentRange) {
        // OPEN
        const [closeHour, closeMinute] = currentRange.end.split(':').map(Number);
        const closeDate = new Date(nowJST.getFullYear(), nowJST.getMonth(), nowJST.getDate(), closeHour, closeMinute);
        return {
            status: 'open',
            statusText: t('status.open'),
            nextChangeText: `${t('status.closes_at')} ${format(closeDate, 'H:mm')}`,
            isOpen: true,
            alert: matchedRule.note,
            hours: currentRange // Export current range
        };
    } else if (isBreak) {
        return {
            status: 'break',
            statusText: t('status.break'),
            nextChangeText: `${t('status.opens_at')} ${nextOpenStart}`,
            isOpen: false,
            alert: matchedRule.note
        };
    } else {
        // Closed (Before start or after end)
        const nextStart = matchedRule.hours.find(h => currentTimeStr < h.start);
        if (nextStart) {
            return {
                status: 'closed',
                statusText: t('status.closed'),
                nextChangeText: `${t('status.opens_at')} ${nextStart.start}`,
                isOpen: false,
                alert: matchedRule.note
            };
        } else {
            return {
                status: 'closed',
                statusText: t('status.closed'),
                nextChangeText: '',
                isOpen: false,
                alert: matchedRule.note
            };
        }
    }
}

export type ScheduleType = 'standard' | 'irregular' | 'closed';

export interface DailyInfo {
    scheduleType: ScheduleType;
    hours: string; // e.g. "9:00-20:00" or simple text like "Closed"
    note?: string;
    color: 'green' | 'pink' | 'gray' | 'orange' | 'blue' | 'purple'; // Added custom colors
}

export function getFacilityDailyInfo(
    facilityId: FacilityId,
    date: Date,
    t: (key: string) => string
): DailyInfo {
    const dateJSTStr = formatJST(date, 'yyyy-MM-dd');
    const facilityData = CONST_SCHEDULE_DATA[facilityId];

    // 1. CHECK EXCEPTIONS
    if (facilityData.exceptions && facilityData.exceptions[dateJSTStr]) {
        const exception = facilityData.exceptions[dateJSTStr];
        if (exception.status === 'closed') {
            return {
                scheduleType: 'closed',
                hours: t('status.closed'), // or exception.reason
                note: exception.reason,
                color: 'gray'
            };
        }
        // If exception is open, it's irregular
        if (exception.status === 'open' && exception.hours) {
            const hoursText = exception.hours.map(h => `${h.start}-${h.end}`).join(', ');
            return {
                scheduleType: 'irregular',
                hours: hoursText,
                note: exception.reason,
                color: 'pink'
            };
        }
    }

    const dayOfWeek = getDay(date); // 0=Sun
    const rules = facilityData.rules;

    // 2. Find matching rule
    let matchedRule: ScheduleRule | undefined;
    let ruleType: ScheduleRule['type'] | undefined;

    // Priority 1: Specific Date
    matchedRule = rules.find(r => r.type === 'specific_date' && r.dates?.some(d => isSameDay(parseISO(d), date)));
    if (matchedRule) ruleType = 'specific_date';

    // Priority 2: National Holiday (Dynamic)
    if (!matchedRule) {
        const isHoliday = holiday_jp.isHoliday(date);
        if (isHoliday) {
            matchedRule = rules.find(r => r.type === 'national_holiday');
            if (matchedRule) {
                ruleType = 'national_holiday';
                const holidayName = holiday_jp.between(date, date)[0]?.name || '祝日';
                matchedRule = { ...matchedRule, note: matchedRule.note === '祝日' ? holidayName : matchedRule.note };
            }
        }
    }

    // Priority 3: Range
    if (!matchedRule) {
        matchedRule = rules.find(r => r.type === 'range' && r.startDate && r.endDate &&
            isWithinInterval(date, { start: parseISO(r.startDate), end: parseISO(r.endDate) })
        );
        if (matchedRule) ruleType = 'range';
    }

    // Priority 4: Day of week
    if (!matchedRule) {
        if (dayOfWeek === 0) { matchedRule = rules.find(r => r.type === 'sunday'); ruleType = 'sunday'; }
        else if (dayOfWeek === 6) { matchedRule = rules.find(r => r.type === 'saturday'); ruleType = 'saturday'; }
        else { matchedRule = rules.find(r => r.type === 'weekday'); ruleType = 'weekday'; }
    }

    // Default to closed if no rule found
    if (!matchedRule || matchedRule.isClosed) {
        return {
            scheduleType: 'closed',
            hours: t('status.closed'),
            note: matchedRule?.note,
            color: 'gray'
        };
    }

    const hoursText = matchedRule.hours.map(h => `${h.start}-${h.end}`).join(', ');

    // Determine base type
    const scheduleType: ScheduleType = (ruleType === 'weekday') ? 'standard' : 'irregular';
    let color: DailyInfo['color'] = scheduleType === 'standard' ? 'green' : 'pink';

    // Custom logic for Store (Hatchpotch)
    if (facilityId === 'store') {
        if (hoursText === '11:00-16:30') color = 'green';       // Standard
        else if (hoursText === '11:00-15:00') color = 'orange'; // Short A
        else if (hoursText === '11:30-13:00') color = 'blue';   // Winter
        else if (hoursText === '11:30-14:30') color = 'purple'; // Exam
        else color = 'pink'; // Fallback for other irregulars
    }

    // Custom logic for Cafeteria (Meal 1F)
    if (facilityId === 'cafeteria_1f') {
        // 11:00-14:30, 11:00-13:30, 11:30-13:00, 11:30-13:30
        if (hoursText === '11:00-14:30') color = 'green';
        else if (hoursText === '11:00-13:30') color = 'orange';
        else if (hoursText === '11:30-13:00') color = 'blue';
        else if (hoursText === '11:30-13:30') color = 'purple';
        else color = 'pink';
    }

    // Custom logic for Sabor (2F)
    if (facilityId === 'sabor_2f') {
        if (hoursText === '11:00-14:30') color = 'orange';
        else color = 'gray';
    }

    // Custom logic for Library
    if (facilityId === 'library') {
        if (hoursText === '09:00-20:00') color = 'green';
        else if (hoursText === '13:00-20:00') color = 'blue';
        else if (hoursText === '09:00-17:00') color = 'orange';
        else color = 'gray'; // Explicit gray for closed/other, though default handles closed
    }

    // Custom logic for Lecture Building
    if (facilityId === 'lecture_bldg') {
        if (hoursText === '07:00-20:00') color = 'green';
        else color = 'gray';
    }

    return {
        scheduleType,
        hours: hoursText,
        note: matchedRule.note,
        color
    };
}
