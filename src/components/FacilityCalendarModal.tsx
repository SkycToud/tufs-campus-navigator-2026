import React, { useState, useEffect } from 'react';
import { format, addMonths, subMonths, isToday, getDay, isSameDay, startOfMonth, startOfWeek, endOfMonth, endOfWeek, eachDayOfInterval } from 'date-fns';
import { ja, enUS } from 'date-fns/locale';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useMonthlySchedule } from '../hooks/useMonthlySchedule';
import { CONST_SCHEDULE_DATA, type FacilityId } from '../lib/schedules';
import { cn } from '../lib/utils';
import { getFacilityDailyInfo } from '../lib/status-utils';
import { getNowJST } from '../lib/date';
import { useLanguage } from '../contexts/LanguageContext';

interface FacilityCalendarModalProps {
    facilityId: FacilityId | null;
    isOpen: boolean;
    onClose: () => void;
}

export function FacilityCalendarModal({ facilityId, isOpen, onClose }: FacilityCalendarModalProps) {
    const { t, language } = useLanguage();
    const [currentDate, setCurrentDate] = useState(getNowJST());

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            // Reset to current month when opening
            setCurrentDate(getNowJST());
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const facilityData = CONST_SCHEDULE_DATA[facilityId];
    const monthStart = startOfMonth(currentDate);
    // Use the calendar starting from Sunday
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const monthEnd = endOfMonth(currentDate);
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

    const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    // Handle Month Navigation
    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

    // Always call hook (rules of hooks), but data is relevant only if facilityId exists
    // We pass a dummy ID if null, but prevent rendering
    const validFacilityId = facilityId || 'library';
    const schedule = useMonthlySchedule(validFacilityId, currentDate); // Use currentDate for monthly schedule

    const facilityName = language === 'ja'
        ? CONST_SCHEDULE_DATA[facilityId].name
        : CONST_SCHEDULE_DATA[facilityId].nameEn;

    // Get selected day info (for detail area)
    const selectedDailyInfo = getFacilityDailyInfo(facilityId, currentDate, t, language); // 0=Sun
    const emptyCells = Array(getDay(schedule[0].date)).fill(null); // Re-calculate empty cells based on the first day of the schedule
    const locale = language === 'ja' ? ja : enUS;

    const weekDays = language === 'ja'
        ? ['日', '月', '火', '水', '木', '金', '土']
        : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const getColorClasses = (color: string) => {
        switch (color) {
            case 'green': return "bg-emerald-50/80 border-emerald-100/50 text-emerald-900";
            case 'pink': return "bg-rose-50/80 border-rose-100/50 text-rose-900";
            case 'gray': return "bg-slate-50/50 border-slate-100 text-slate-400";
            case 'orange': return "bg-amber-50/80 border-amber-100/50 text-amber-900";
            case 'blue': return "bg-sky-50/80 border-sky-100/50 text-sky-900";
            case 'purple': return "bg-indigo-50/80 border-indigo-100/50 text-indigo-900";
            default: return "bg-slate-50 border-slate-100 text-slate-400";
        }
    };

    const getDotColor = (color: string) => {
        switch (color) {
            case 'green': return "bg-emerald-400";
            case 'pink': return "bg-rose-400";
            case 'gray': return "bg-slate-300";
            case 'orange': return "bg-amber-400";
            case 'blue': return "bg-sky-400";
            case 'purple': return "bg-indigo-400";
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
                        {CONST_SCHEDULE_DATA[facilityId]?.unpublishedFrom &&
                            currentDate >= new Date(CONST_SCHEDULE_DATA[facilityId].unpublishedFrom!) && (
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

                                // Custom Logic for University Events
                                let colorClass, dotClass;
                                if (facilityId === 'university_events') {
                                    if (day.info.note) {
                                        if (day.info.note.includes('履修') || day.info.note.includes('成績')) {
                                            // Highlight "Registration" & "Grade Inquiry" events (Orange/Amber)
                                            colorClass = "bg-amber-50/90 border-amber-200 text-amber-900";
                                            dotClass = "bg-amber-500";
                                        } else {
                                            // All other events (Uniform Blue/Indigo)
                                            colorClass = "bg-indigo-50/80 border-indigo-100/50 text-indigo-900";
                                            dotClass = "bg-indigo-400";
                                        }
                                    } else {
                                        // Empty days
                                        colorClass = "bg-slate-50 border-slate-100 text-slate-400";
                                        dotClass = "bg-slate-300 hidden"; // Hide dot for empty days
                                    }
                                } else {
                                    // Standard Logic
                                    colorClass = getColorClasses(day.info.color || 'gray');
                                    dotClass = getDotColor(day.info.color || 'gray');
                                }

                                const isSelected = isSameDay(day.date, currentDate);

                                return (
                                    <button
                                        key={day.date.toISOString()}
                                        onClick={() => setCurrentDate(day.date)}
                                        className={cn(
                                            "min-h-[60px] p-1.5 rounded-lg border text-xs relative flex flex-col transition-all text-left",
                                            isCurrentDay && "ring-2 ring-accent ring-offset-1 z-10",
                                            isSelected && "ring-2 ring-indigo-500 ring-offset-1 z-10",
                                            !isCurrentDay && !isSelected && "hover:ring-2 hover:ring-black/5 hover:z-10",
                                            colorClass
                                        )}
                                    >
                                        <div className="flex justify-between items-start mb-0.5 w-full">
                                            <span className={cn(
                                                "font-bold text-sm",
                                                isCurrentDay && "text-accent"
                                            )}>
                                                {format(day.date, 'd')}
                                            </span>
                                            {/* Status Dot */}
                                            <div className={cn(
                                                "w-2 h-2 rounded-full shrink-0 mt-1",
                                                dotClass
                                            )} />
                                        </div>

                                        <div className="flex-1 flex flex-col justify-end w-full min-h-0">
                                            <p className="font-bold leading-tight text-[10px] truncate">
                                                {day.info.hours}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })}
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
