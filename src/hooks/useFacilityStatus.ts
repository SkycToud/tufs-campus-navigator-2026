import { useState, useEffect } from 'react';
import { type FacilityId } from '../lib/schedules';
import { getNowJST } from '../lib/date';
import { useLanguage } from '../contexts/LanguageContext';
import { useMaintenance } from '../contexts/MaintenanceContext';
import { calculateFacilityStatus, type StatusResult, type FacilityStatus } from '../lib/status-utils';

export type { FacilityStatus, StatusResult };

export function useFacilityStatus(facilityId: FacilityId, date: Date = new Date()): StatusResult {
    const { t, language } = useLanguage();
    const { isMaintenanceMode } = useMaintenance();
    const [result, setResult] = useState<StatusResult>({
        status: 'closed',
        statusText: 'Closed',
        nextChangeText: '',
        isOpen: false,
    });

    useEffect(() => {
        const calculateStatus = () => {
            const now = getNowJST();

            const statusResult = calculateFacilityStatus(
                facilityId,
                date,
                now,
                t,
                isMaintenanceMode
            );

            setResult(statusResult);
        };

        calculateStatus();
        const timer = setInterval(calculateStatus, 60000); // Update every minute
        return () => clearInterval(timer);
    }, [facilityId, date, isMaintenanceMode, language, t]);

    return result;
}
