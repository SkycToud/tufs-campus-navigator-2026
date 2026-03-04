import { useState, useEffect } from 'react';
import { format, addMonths, subMonths, isToday, getDay, isSameDay } from 'date-fns';
import { ja, enUS } from 'date-fns/locale';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useMonthlySchedule } from '../hooks/useMonthlySchedule';
import { CONST_SCHEDULE_DATA, type FacilityId } from '../lib/schedules';
import { getNowJST } from '../lib/date';
import { cn } from '../lib/utils';
import { getFacilityDailyInfo } from '../lib/status-utils';
import { useLanguage } from '../contexts/LanguageContext';

interface FacilityCalendarModalProps {
    facilityId: FacilityId;
    isOpen: boolean;
    onClose: () => void;
    initialDate?: Date;
}

export const FacilityCalendarModal: React.FC<FacilityCalendarModalProps> = ({ facilityId, isOpen, onClose, initialDate }) => {
    const { t, language } = useLanguage();
    // Initialize with initialDate if present, otherwise current JST time
    const [currentDate, setCurrentDate] = useState(() => initialDate || getNowJST());

    // Update currentDate when modal opens or initialDate changes
    useEffect(() => {
        if (isOpen) {
            setCurrentDate(initialDate || getNowJST());
        }
    }, [isOpen, initialDate]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    // Always call hook (rules of hooks), but data is relevant only if facilityId exists
    // We pass a dummy ID if null, but prevent rendering
    const validFacilityId = facilityId || 'library';


    // Handle Month Navigation
    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

    const schedule = useMonthlySchedule(validFacilityId, currentDate); // Use currentDate for monthly schedule

    const facilityName = language === 'ja'
        ? CONST_SCHEDULE_DATA[validFacilityId].name
        : CONST_SCHEDULE_DATA[validFacilityId].nameEn;


    const emptyCells = Array(getDay(schedule[0].date)).fill(null); // Re-calculate empty cells based on the first day of the schedule
    const locale = language === 'ja' ? ja : enUS;

    const weekDays = language === 'ja'
        ? ['日', '月', '火', '水', '木', '金', '土']
        : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const formatHours = (hours: string) => {
        return hours; // Return original HH:mm-HH:mm format
    };

    const getColorClasses = (color: string, isClosed?: boolean) => {
        if (isClosed) return "bg-slate-50 border-slate-200 text-slate-400 opacity-60";
        switch (color) {
            case 'green': return "bg-emerald-100/80 border-emerald-200 text-emerald-950 shadow-sm";
            case 'pink': return "bg-rose-100/80 border-rose-200 text-rose-950 shadow-sm";
            case 'gray': return "bg-slate-100 border-slate-200 text-slate-600";
            case 'orange': return "bg-amber-100/80 border-amber-200 text-amber-950 shadow-sm";
            case 'blue': return "bg-sky-100/80 border-sky-200 text-sky-950 shadow-sm";
            case 'purple': return "bg-indigo-100/80 border-indigo-200 text-indigo-950 shadow-sm";
            default: return "bg-slate-50 border-slate-100 text-slate-400";
        }
    };

    const getDotColor = (color: string, isClosed?: boolean) => {
        if (isClosed) return "bg-slate-300";
        switch (color) {
            case 'green': return "bg-emerald-500";
            case 'pink': return "bg-rose-500";
            case 'gray': return "bg-slate-400";
            case 'orange': return "bg-amber-500";
            case 'blue': return "bg-sky-500";
            case 'purple': return "bg-indigo-500";
            default: return "bg-slate-300";
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
            <div className="w-full sm:max-w-md bg-calm-bg rounded-2xl shadow-xl overflow-hidden border border-white/20 animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-200 flex flex-col max-h-[75vh] sm:max-h-[85vh] safe-pb" onClick={e => e.stopPropagation()}>
                {/* Header Section (Fixed) */}
                <div className="flex-none bg-calm-bg z-10 relative">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-calm-text truncate pr-4">
                            {facilityName}
                        </h3>
                        <button
                            onClick={onClose}
                            className="p-2 -mr-2 text-calm-subtext hover:text-calm-text hover:bg-black/5 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Month Navigation */}
                    <div className="px-4 py-3 flex items-center justify-between text-calm-text border-b border-slate-50">
                        <button onClick={prevMonth} className="p-1 hover:bg-white/50 rounded-full transition-colors">
                            <ChevronLeft size={20} />
                        </button>
                        <span className="font-bold text-lg font-mono tracking-tight">
                            {format(currentDate, 'yyyy / M', { locale })}
                        </span>
                        <button onClick={nextMonth} className="p-1 hover:bg-white/50 rounded-full transition-colors">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                {/* Day Headers (Fixed) */}
                <div className="flex-none px-4 pt-4 pb-2 bg-calm-bg z-10 border-b border-slate-50 shadow-sm">
                    <div className="grid grid-cols-7 gap-1 text-center">
                        {weekDays.map((d, i) => (
                            <div key={d} className={`text-xs font-bold ${i === 0 ? 'text-rose-400' : i === 6 ? 'text-indigo-400' : 'text-calm-subtext'}`}>
                                {d}
                            </div>
                        ))}
                    </div>
                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent relative">
                        {/* Unpublished Overlay */}
                        {CONST_SCHEDULE_DATA[validFacilityId]?.unpublishedFrom &&
                            currentDate >= new Date(CONST_SCHEDULE_DATA[validFacilityId].unpublishedFrom!) && (
                                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[2px] p-6 text-center animate-in fade-in duration-300">
                                    <div className="bg-white p-4 rounded-2xl shadow-lg border border-slate-100/50">
                                        <p className="text-calm-subtext font-bold mb-1">{format(currentDate, 'M月', { locale })}</p>
                                        <p className="text-lg font-bold text-calm-text">{t('status.unpublished')}</p>
                                    </div>
                                </div>
                            )}

                        <div className="grid grid-cols-7 gap-1">
                            {emptyCells.map((_, i) => (
                                <div key={`empty-${i}`} />
                            ))}
                            {schedule.map((day) => {
                                const isCurrentDay = isToday(day.date);
                                const isSelected = isSameDay(day.date, currentDate);
                                const colorClass = getColorClasses(day.info.color || 'gray', day.info.isClosed);
                                const dotClass = getDotColor(day.info.color || 'gray', day.info.isClosed);

                                return (
                                    <button
                                        key={day.date.toISOString()}
                                        onClick={() => setCurrentDate(day.date)}
                                        className={cn(
                                            "min-h-[50px] p-1.5 rounded-lg border text-xs relative flex flex-col transition-all text-left",
                                            isCurrentDay && "ring-2 ring-accent ring-offset-1 z-10",
                                            isSelected && "ring-2 ring-indigo-500 ring-offset-1 z-10",
                                            !isCurrentDay && !isSelected && "hover:ring-2 hover:ring-black/5 hover:z-10",
                                            colorClass
                                        )}
                                    >
                                        <div className="flex justify-between items-start w-full">
                                            <span className={cn(
                                                "font-bold text-sm",
                                                isCurrentDay && "text-accent"
                                            )}>
                                                {format(day.date, 'd')}
                                            </span>
                                            <div className={cn(
                                                "w-2 h-2 rounded-full shrink-0 mt-1",
                                                dotClass
                                            )} />
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Dynamic Legend */}
                        <div className="mt-4 pt-3 border-t border-slate-50 flex flex-wrap justify-center gap-x-4 gap-y-2">
                            {(() => {
                                // Collect unique hours for open days
                                const items = schedule.reduce((acc, day) => {
                                    if (day.info.isClosed) return acc;
                                    const key = `${day.info.color}-${day.info.hours}`;
                                    if (!acc.find(i => i.key === key)) {
                                        acc.push({
                                            key,
                                            color: day.info.color,
                                            hours: day.info.hours,
                                            isStandard: day.info.scheduleType === 'standard'
                                        });
                                    }
                                    return acc;
                                }, [] as { key: string; color: string; hours: string; isStandard: boolean }[]);

                                // Sort: standard (green) first
                                items.sort((a, b) => (a.isStandard ? -1 : b.isStandard ? 1 : 0));

                                return (
                                    <>
                                        {items.map(item => (
                                            <div key={item.key} className="flex items-center gap-1.5">
                                                <div className={cn("w-3 h-3 rounded-full", getDotColor(item.color))} />
                                                <span className="text-[10px] font-bold text-calm-subtext">
                                                    {formatHours(item.hours)}
                                                    {item.isStandard && (language === 'ja' ? ' (通常)' : ' (Regular)')}
                                                </span>
                                            </div>
                                        ))}
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-3 h-3 rounded-full bg-slate-300" />
                                            <span className="text-[10px] font-bold text-calm-subtext">
                                                {t('status.closed')}
                                            </span>
                                        </div>
                                    </>
                                );
                            })()}
                        </div>

                    </div>
                </div>

                {/* Detail Area */}
                <div className="bg-white/80 backdrop-blur-md rounded-xl p-4 border border-white/50 shadow-sm animate-in slide-in-from-bottom-2 duration-300 sticky bottom-0 z-10 mx-4 mb-4">
                    {(() => {
                        const info = getFacilityDailyInfo(validFacilityId, currentDate, t, language);
                        return (
                            <div className="flex flex-col gap-2">
                                <div className="flex items-baseline justify-between border-b border-slate-100 pb-2">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-lg font-bold text-calm-text">
                                            {format(currentDate, 'M/d', { locale })}
                                        </span>
                                        <span className="text-sm font-bold text-calm-subtext">
                                            ({format(currentDate, 'EEE', { locale })})
                                        </span>
                                    </div>
                                    <span className={`text-sm font-bold px-2 py-0.5 rounded-md ${info.scheduleType === 'closed' ? 'bg-slate-100 text-slate-500' : 'bg-emerald-100 text-emerald-700'}`}>
                                        {info.hours}
                                    </span>
                                </div>

                                {info.note ? (
                                    <div className="py-1">
                                        <p className="text-sm text-calm-text font-medium leading-relaxed">
                                            {info.note}
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-sm text-calm-subtext italic py-1">
                                        {t('status.no_note_plain') || '特記事項なし'}
                                    </p>
                                )}
                            </div>
                        );
                    })()}
                </div>
            </div>
        </div >
    );
};
