import { useFacilityStatus, type FacilityStatus } from '../hooks/useFacilityStatus';
import { cn } from '../lib/utils';
import { type FacilityId } from '../lib/schedules';
import { Book, Coffee, Utensils, ShoppingBasket, GraduationCap, Building2, CreditCard, Printer, Users, School, Globe, Croissant, Calendar } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { CONST_SCHEDULE_DATA } from '../lib/schedules';

const ICON_MAP: Record<FacilityId, React.ElementType> = {
    library: Book,
    cafeteria_1f: Utensils,
    sabor_2f: Coffee,
    store: ShoppingBasket,
    academic_affairs: GraduationCap,
    admission: Building2,
    accounting: CreditCard,
    cert_machine: Printer,
    circle_bldg: Users,
    lecture_bldg: School,
    agora_global: Globe,
    cafe_castalia: Croissant,
    admin_bldg: Building2,
    university_events: Calendar,
};

const STATUS_Styles: Record<FacilityStatus, { bg: string; text: string; dot: string; border: string }> = {
    open: { bg: 'bg-emerald-50/80', text: 'text-emerald-700', dot: 'bg-emerald-500', border: 'border-emerald-200' },
    closing_soon: { bg: 'bg-amber-50/80', text: 'text-amber-700', dot: 'bg-amber-500', border: 'border-amber-200' },
    break: { bg: 'bg-yellow-50/80', text: 'text-yellow-700', dot: 'bg-yellow-500', border: 'border-yellow-200' },
    closed: { bg: 'bg-slate-50/50', text: 'text-slate-500', dot: 'bg-slate-400', border: 'border-slate-100' },
};

interface FacilityCardProps {
    facilityId: FacilityId;
    date: Date;
    compact?: boolean;
    onClick?: () => void;
}

export const FacilityCard: React.FC<FacilityCardProps> = ({ facilityId, date, compact = false, onClick }) => {
    const { language } = useLanguage();
    const { status, statusText, nextChangeText, alert } = useFacilityStatus(facilityId, date);
    const facilityData = CONST_SCHEDULE_DATA[facilityId];

    const displayName = language === 'en' && facilityData?.nameEn ? facilityData.nameEn : facilityData.name;

    const Icon = ICON_MAP[facilityId];
    const styles = STATUS_Styles[status];

    if (compact) {
        return (
            <div onClick={onClick} className={cn("glass p-3 rounded-xl flex items-center justify-between border transition-all", styles.border)}>
                <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className={cn("p-2 rounded-full shrink-0", styles.bg)}>
                        <Icon size={18} className={styles.text} />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-calm-text text-sm leading-tight whitespace-normal break-words">{displayName}</h3>
                        {alert && <p className="text-[10px] text-amber-600 font-bold truncate">{alert}</p>}
                    </div>
                </div>
                <div className="text-right shrink-0 ml-2 max-w-[45%]">
                    <div className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-bold w-full justify-end flex-wrap", styles.bg, styles.text)}>
                        <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse shrink-0", styles.dot)} />
                        <span className="whitespace-normal text-right">{statusText}</span>
                    </div>
                    {nextChangeText && <p className="text-[10px] text-slate-400 mt-0.5 break-words whitespace-normal leading-tight">{nextChangeText}</p>}
                </div>
            </div>
        );
    }

    // Full Card
    // Full Card
    if (facilityId === 'university_events') {
        const eventText = alert || '予定なし';

        return (
            <div
                onClick={onClick}
                className={cn(
                    "glass p-4 rounded-2xl flex items-center gap-3 border shadow-sm transition-all hover:shadow-md border-indigo-100 bg-indigo-50/30",
                    onClick && "cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                )}
            >
                <div className={cn("p-2.5 rounded-xl shrink-0 bg-indigo-100 text-indigo-600")}>
                    <Icon size={24} />
                </div>
                <div className="min-w-0 flex-1">
                    <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-bold text-calm-text text-base leading-tight whitespace-normal break-words">{displayName}</h3>
                    </div>
                    <p className="text-sm font-semibold text-slate-700 break-words">
                        {eventText === '予定なし' && language === 'en' ? 'No events' : eventText}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div
            onClick={onClick}
            className={cn(
                "glass p-4 rounded-2xl flex flex-col gap-3 border shadow-sm transition-all hover:shadow-md",
                styles.border,
                onClick && "cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            )}
        >
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3 min-w-0">
                    <div className={cn("p-2.5 rounded-xl shrink-0", styles.bg)}>
                        <Icon size={24} className={styles.text} />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-calm-text text-sm md:text-base leading-tight whitespace-normal break-words">{displayName}</h3>

                    </div>
                </div>
                <div className={cn("flex flex-none items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold justify-end flex-wrap border", styles.bg, styles.text, styles.border)}>
                    <span className={cn("w-2 h-2 rounded-full shrink-0", status === 'open' && "animate-pulse", styles.dot)} />
                    <span className="whitespace-normal text-right">{statusText}</span>
                </div>
            </div>

            <div className="mt-1 flex items-end justify-between">
                <div className="flex flex-col min-w-0 w-full">
                    <span className="text-sm font-semibold text-slate-700 break-words">{nextChangeText || 'See details'}</span>
                </div>
            </div>

            {alert && (
                <div className="mt-1 px-3 py-2 bg-amber-50 border border-amber-100 rounded-lg text-xs text-amber-800 font-medium flex items-center gap-2">
                    <span>⚠️</span> {alert}
                </div>
            )}
        </div>
    );
}
