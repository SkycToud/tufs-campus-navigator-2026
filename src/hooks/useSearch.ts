import { useMemo } from 'react';
import { useSearchContext } from '../contexts/SearchContext';
import { CONST_SCHEDULE_DATA, type FacilityId } from '../lib/schedules';

export function useSearch() {
    const { query } = useSearchContext();

    const filteredFacilityIds = useMemo(() => {
        if (!query.trim()) return null; // Return null if no search active

        const lowerQuery = query.toLowerCase().trim();
        const allIds = Object.keys(CONST_SCHEDULE_DATA) as FacilityId[];

        return allIds.filter((id) => {
            const facility = CONST_SCHEDULE_DATA[id];

            // Search criteria:
            // 1. Name (Japanese)
            const matchName = facility.name.toLowerCase().includes(lowerQuery);

            // 2. Name (English)
            const matchNameEn = facility.nameEn.toLowerCase().includes(lowerQuery);

            // 3. Category (Simple check, can be expanded)
            // e.g. "shop" -> matches store, cafeteria
            // "admin" -> matches admin facilities
            let matchCategory = false;
            if (lowerQuery.includes('shop') || lowerQuery.includes('食') || lowerQuery.includes('売')) {
                // Approximate category matching logic
                if (['cafeteria_1f', 'sabor_2f', 'store', 'cafe_castalia'].includes(id)) matchCategory = true;
            }
            if (lowerQuery.includes('admin') || lowerQuery.includes('事務')) {
                if (facility.category === 'admin' || id === 'admin_bldg') matchCategory = true;
            }

            // 4. Event Names / Notes (Rules & Exceptions)
            const matchEvent = facility.rules.some(rule => rule.note && rule.note.toLowerCase().includes(lowerQuery)) ||
                (facility.exceptions && Object.values(facility.exceptions).some(ex => ex.reason && ex.reason.toLowerCase().includes(lowerQuery)));

            return matchName || matchNameEn || matchCategory || matchEvent;
        });
    }, [query]);

    return { query, filteredFacilityIds };
}
