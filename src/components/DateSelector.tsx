import { useRef, useState, useEffect } from 'react';
import { addDays, isSameDay, subDays } from 'date-fns';
import { getNowJST, formatJST } from '../lib/date';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';
import { ja, enUS } from 'date-fns/locale';

interface DateSelectorProps {
    currentDate: Date;
    onDateChange: (date: Date) => void;
}

export function DateSelector({ currentDate, onDateChange }: DateSelectorProps) {
    const { t, language } = useLanguage();
    const today = getNowJST();
    const tomorrow = addDays(today, 1);

    const isToday = isSameDay(currentDate, today);
    const isTomorrow = isSameDay(currentDate, tomorrow);

    const handlePrevDay = () => onDateChange(subDays(currentDate, 1));
    const handleNextDay = () => onDateChange(addDays(currentDate, 1));

    const inputRef = useRef<HTMLInputElement>(null);
    // Use new Date() directly to hold the true UTC timestamp. 
    // formatJST will handle the conversion to 'Asia/Tokyo' correctly.
    // getNowJST() shifts the time, which would cause formatJST to shift it AGAIN.
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setNow(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex flex-col gap-3 py-2">
            <div className="flex items-center justify-between bg-white/40 p-1 rounded-xl border border-white/30 backdrop-blur-sm">
                <button
                    onClick={() => onDateChange(today)}
                    className={cn("flex-1 py-1.5 text-sm font-bold rounded-lg transition-all", isToday ? "bg-white shadow-sm text-accent" : "text-calm-subtext hover:text-calm-text")}
                >
                    {t('date.today')}
                </button>
                <button
                    onClick={() => onDateChange(tomorrow)}
                    className={cn("flex-1 py-1.5 text-sm font-bold rounded-lg transition-all", isTomorrow ? "bg-white shadow-sm text-accent" : "text-calm-subtext hover:text-calm-text")}
                >
                    {t('date.tomorrow')}
                </button>
            </div>

            <div className="flex items-center justify-between gap-4">
                <button onClick={handlePrevDay} className="p-2 rounded-full glass hover:bg-white/80 active:scale-95 transition-all text-slate-600">
                    <ChevronLeft size={20} />
                </button>

                <div className="flex flex-col items-center relative gap-0.5">
                    <span className="text-xs font-bold text-calm-subtext">Target Date</span>
                    <button
                        onClick={() => {
                            try {
                                inputRef.current?.showPicker();
                            } catch (e) {
                                // Fallback for browsers not supporting showPicker or if other error
                                inputRef.current?.click();
                            }
                        }}
                        className="flex items-center gap-2 text-accent cursor-pointer relative z-10 p-1 -m-1 rounded hover:bg-white/50 transition-colors"
                    >
                        <CalendarIcon size={16} />
                        <span className="text-lg font-bold font-mono tracking-tight">
                            {formatJST(
                                currentDate,
                                language === 'ja' ? 'M/d（E）' : 'M/d (E)',
                                { locale: language === 'ja' ? ja : enUS }
                            )}
                        </span>
                        <input
                            ref={inputRef}
                            type="date"
                            className="absolute inset-0 opacity-0 pointer-events-none w-full h-full"
                            style={{ visibility: 'hidden', position: 'absolute' }} // Hide it completely visually but keep it in DOM
                            value={formatJST(currentDate, 'yyyy-MM-dd')}
                            onChange={(e) => {
                                if (e.target.value) {
                                    const parts = e.target.value.split('-').map(Number);
                                    const newDate = new Date(parts[0], parts[1] - 1, parts[2]);
                                    onDateChange(newDate);
                                }
                            }}
                        />
                    </button>
                    {isToday && (
                        <span className="text-sm font-bold text-calm-subtext font-mono tracking-wide">
                            {formatJST(now, 'HH:mm')}
                        </span>
                    )}
                </div>

                <button onClick={handleNextDay} className="p-2 rounded-full glass hover:bg-white/80 active:scale-95 transition-all text-slate-600">
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
}
