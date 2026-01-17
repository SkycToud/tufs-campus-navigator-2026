import { useMemo } from 'react';
import { useSearchContext } from '../contexts/SearchContext';
import { CONST_SCHEDULE_DATA, type FacilityId } from '../lib/schedules';
import { parseISO, eachDayOfInterval } from 'date-fns';
import * as holiday_jp from 'holiday-jp';
import { useLanguage } from '../contexts/LanguageContext';

export interface SearchResult {
    date: Date;
    facilityId: FacilityId;
    facilityName: string;
    eventName: string;
    status: 'open' | 'closed' | 'irregular';
}

export function useEventSearch() {
    const { query } = useSearchContext();
    const { t } = useLanguage();

    const results = useMemo(() => {
        if (!query.trim()) return [];

        const lowerQuery = query.toLowerCase().trim();
        const searchResults: SearchResult[] = [];

        // Define search range (Hardcoded for the 2026 scope of the app)
        const searchStart = new Date(2026, 0, 1); // Jan 1 2026
        const searchEnd = new Date(2026, 3, 31); // Apr 31 2026
        // Actually app only has Jan-Mar data mostly, but let's be safe.

        const facilities = Object.entries(CONST_SCHEDULE_DATA) as [FacilityId, typeof CONST_SCHEDULE_DATA[FacilityId]][];

        facilities.forEach(([id, data]) => {
            // 1. Check Exceptions
            if (data.exceptions) {
                Object.entries(data.exceptions).forEach(([dateStr, exc]) => {
                    // Translate exception reason if it's a key (though usually they are literal)
                    const excReason = exc.reason || '';
                    const translatedReason = excReason.startsWith('note.') ? t(excReason as any) : excReason;

                    if (translatedReason && translatedReason.toLowerCase().includes(lowerQuery)) {
                        searchResults.push({
                            date: parseISO(dateStr),
                            facilityId: id,
                            facilityName: data.name,
                            eventName: translatedReason,
                            status: exc.status === 'closed' ? 'closed' : 'irregular'
                        });
                    }
                });
            }

            // 2. Check Rules
            data.rules.forEach(rule => {
                const rawNote = rule.note || '';
                const translatedNote = rawNote.startsWith('note.') ? t(rawNote as any) : rawNote;
                const matchNote = translatedNote && translatedNote.toLowerCase().includes(lowerQuery);

                // Special handling for National Holidays search
                // If query matches "祝日" or "Holiday" or specific holiday name like "成人の日"
                // We need to resolve national holidays.

                if (rule.type === 'specific_date' && matchNote && rule.dates) {
                    rule.dates.forEach(d => {
                        searchResults.push({
                            date: parseISO(d),
                            facilityId: id,
                            facilityName: data.name,
                            eventName: translatedNote!,
                            status: rule.isClosed ? 'closed' : 'irregular'
                        });
                    });
                }

                if (rule.type === 'range' && matchNote && rule.startDate && rule.endDate) {
                    const start = parseISO(rule.startDate);
                    const end = parseISO(rule.endDate);
                    // Generate days
                    const days = eachDayOfInterval({ start, end });
                    days.forEach(d => {
                        searchResults.push({
                            date: d,
                            facilityId: id,
                            facilityName: data.name,
                            eventName: translatedNote!,
                            status: rule.isClosed ? 'closed' : 'irregular'
                        });
                    });
                }

                // If rule is national_holiday, we check if today is matching holiday?
                // No, we want to find FUTURE holidays.
                if (rule.type === 'national_holiday') {
                    // Check if query matches specific holiday name
                    const holidays = holiday_jp.between(searchStart, searchEnd);
                    holidays.forEach(h => {
                        // Check if query matches holiday name OR if rule.note matches query (e.g. "Holiday")
                        // But usually rule.note is just "祝日".
                        // If user types "Adult" (Coming of Age), we want to match.
                        const matchHolidayName = h.name.includes(query) || (h.name_en && h.name_en.toLowerCase().includes(lowerQuery));
                        const matchRuleNote = translatedNote && translatedNote.toLowerCase().includes(lowerQuery);

                        if (matchHolidayName || matchRuleNote) {
                            searchResults.push({
                                date: new Date(h.date.getTime()),
                                facilityId: id,
                                facilityName: data.name,
                                eventName: h.name, // Use actual holiday name
                                status: rule.isClosed ? 'closed' : 'irregular' // usually closed
                            });
                        }
                    });
                }
            });
        });

        // Deduplicate?
        // Sometimes multiple rules might yield same date/event.
        // Or same event across multiple facilities (e.g. Common Test).
        // If sorting by Date, duplicates from different facilities are OK (shows "Library: Common Test", "Lecture: Common Test" etc.)

        // Sort by Date
        return searchResults.sort((a, b) => a.date.getTime() - b.date.getTime());

    }, [query]);

    return results;
}
