import React, { useState } from 'react';
import { format, addMonths, subMonths, isToday, getDay } from 'date-fns';
import { ja, enUS } from 'date-fns/locale';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useMonthlySchedule } from '../hooks/useMonthlySchedule';
import { CONST_SCHEDULE_DATA, type FacilityId } from '../lib/schedules';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';

interface FacilityCalendarModalProps {
    facilityId: FacilityId | null;
    isOpen: boolean;
    onClose: () => void;
}

export const FacilityCalendarModal: React.FC<FacilityCalendarModalProps> = ({ facilityId, isOpen, onClose }) => {
    const { language } = useLanguage();
    const [currentMonth, setCurrentMonth] = useState(new Date());

    // Prevent background scrolling when modal is open
    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Always call hook (rules of hooks), but data is relevant only if facilityId exists
    // We pass a dummy ID if null, but prevent rendering
    const validFacilityId = facilityId || 'library';
    const schedule = useMonthlySchedule(validFacilityId, currentMonth);

    if (!isOpen || !facilityId) return null;

    const facilityName = language === 'ja'
        ? CONST_SCHEDULE_DATA[facilityId].name
        : CONST_SCHEDULE_DATA[facilityId].nameEn;

    const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
    const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

    // Calendar Grid Logic
    const startDayOfWeek = getDay(schedule[0].date); // 0=Sun
    const emptyCells = Array(startDayOfWeek).fill(null);
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center sm:items-center items-end p-0 sm:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
            <div className="w-full sm:max-w-md bg-calm-bg rounded-t-2xl sm:rounded-2xl shadow-xl overflow-hidden border-t sm:border border-white/20 animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-200 flex flex-col max-h-[75vh] sm:max-h-[85vh] safe-pb" onClick={e => e.stopPropagation()}>
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
                        <button onClick={handlePrevMonth} className="p-1 hover:bg-white/50 rounded-full transition-colors">
                            <ChevronLeft size={20} />
                        </button>
                        <span className="font-bold text-lg font-mono tracking-tight">
                            {format(currentMonth, 'yyyy / M', { locale })}
                        </span>
                        <button onClick={handleNextMonth} className="p-1 hover:bg-white/50 rounded-full transition-colors">
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
                    <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                        <div className="grid grid-cols-7 gap-1">
                            {emptyCells.map((_, i) => (
                                <div key={`empty-${i}`} />
                            ))}
                            {schedule.map((day) => {
                                const isCurrentDay = isToday(day.date);
                                const colorClass = getColorClasses(day.info.color || 'gray');
                                const dotClass = getDotColor(day.info.color || 'gray');

                                return (
                                    <div
                                        key={day.date.toISOString()}
                                        className={cn(
                                            "min-h-[80px] p-1.5 rounded-lg border text-xs relative flex flex-col transition-all",
                                            isCurrentDay && "ring-2 ring-accent ring-offset-1",
                                            colorClass
                                        )}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <span className={cn(
                                                "font-bold text-sm",
                                                isCurrentDay && "text-accent"
                                            )}>
                                                {format(day.date, 'd')}
                                            </span>
                                            {/* Status Dot */}
                                            <div className={cn(
                                                "w-2 h-2 rounded-full",
                                                dotClass
                                            )} />
                                        </div>

                                        <div className="flex-1 flex flex-col justify-center gap-0.5">
                                            <p className="font-medium leading-tight text-[10px] break-words">
                                                {day.info.hours}
                                            </p>
                                            {day.info.note && (
                                                <p className="text-[9px] opacity-75 font-normal truncate">
                                                    {day.info.note}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};
