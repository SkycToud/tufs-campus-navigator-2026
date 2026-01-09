import { useState } from 'react';
import { FacilityCard } from './FacilityCard';
import { ChevronDown, Building } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';

interface AdminAccordionProps {
    date: Date;
}

export function AdminAccordion({ date }: AdminAccordionProps) {
    const { t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="glass rounded-2xl overflow-hidden border border-white/40 shadow-sm">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-5 py-4 flex items-center justify-between bg-white/40 hover:bg-white/60 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 text-indigo-700 rounded-xl">
                        <Building size={20} />
                    </div>
                    <div className="text-left">
                        <h3 className="font-bold text-calm-text">{t('facility.admin_bldg')}</h3>
                    </div>
                </div>
                <div className={cn("text-slate-400 transition-transform duration-300", isOpen && "rotate-180")}>
                    <ChevronDown size={20} />
                </div>
            </button>

            <div className={cn("transition-all duration-300 divide-y divide-slate-100", isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0")}>
                <div className="p-2 flex flex-col gap-2 bg-white/30">
                    <FacilityCard facilityId="academic_affairs" date={date} compact />
                    <FacilityCard facilityId="admission" date={date} compact />
                    <FacilityCard facilityId="accounting" date={date} compact />
                </div>
            </div>
        </div>
    );
}
