declare module 'holiday-jp' {
    export interface Holiday {
        date: Date;
        week: string;
        week_en: string;
        name: string;
        name_en: string;
    }

    export const holidays: { [key: string]: Holiday };

    export function isHoliday(date: Date): boolean;
    export function between(start: Date, end: Date): Holiday[];
}
