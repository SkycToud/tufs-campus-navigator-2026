import { startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { type FacilityId } from '../lib/schedules';
import { useLanguage } from '../contexts/LanguageContext';
import { useMaintenance } from '../contexts/MaintenanceContext';
import { getFacilityDailyInfo, type DailyInfo } from '../lib/status-utils';

export interface DailySchedule {
    date: Date;
    info: DailyInfo;
}

export function useMonthlySchedule(facilityId: FacilityId, month: Date): DailySchedule[] {
    const { t, language } = useLanguage();
    const { isMaintenanceMode } = useMaintenance();

    // Calculate days in the month
    const start = startOfMonth(month);
    const end = endOfMonth(month);
    const days = eachDayOfInterval({ start, end });

    const schedule: DailySchedule[] = days.map(day => {
        if (isMaintenanceMode) {
            return {
                date: day,
                info: {
                    scheduleType: 'closed',
                    hours: 'Maintenance',
                    note: 'System Maintenance',
                    color: 'gray'
                }
            };
        }

        const result = getFacilityDailyInfo(
            facilityId,
            day,
            t,
            language
        );

        return {
            date: day,
            info: result
        };
    });

    return schedule;
}
