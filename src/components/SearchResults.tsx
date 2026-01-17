import React from 'react';
import { format } from 'date-fns';
import { ja, enUS } from 'date-fns/locale';
import type { SearchResult } from '../hooks/useEventSearch';
import { useLanguage } from '../contexts/LanguageContext';
import { type FacilityId } from '../lib/schedules';
import { Calendar, MapPin } from 'lucide-react';

interface SearchResultsProps {
    results: SearchResult[];
    onSelectFacility: (id: FacilityId) => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({ results, onSelectFacility }) => {
    const { language } = useLanguage();
    const locale = language === 'ja' ? ja : enUS;

    if (results.length === 0) return null;

    // Group by Month? Or just list.
    // Let's just list with sticky date headers or just list.
    // Simple list for now.

    return (
        <div className="mb-8 space-y-4 animate-in slide-in-from-top-4 duration-500">
            <h2 className="text-sm font-bold text-calm-subtext uppercase tracking-wider pl-2 flex items-center gap-2">
                <Calendar size={14} />
                {language === 'ja' ? 'イベント検索結果' : 'Event Search Results'}
                <span className="ml-auto bg-accent/10 text-accent px-2 py-0.5 rounded-full text-xs">
                    {results.length} found
                </span>
            </h2>

            <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {results.map((result, index) => (
                    <button
                        key={`${result.facilityId}-${result.date.getTime()}-${index}`}
                        onClick={() => onSelectFacility(result.facilityId)}
                        className="flex flex-col text-left bg-white/60 hover:bg-white border border-white/60 hover:border-accent/40 shadow-sm hover:shadow-md rounded-xl p-4 transition-all group"
                    >
                        <div className="flex items-start justify-between w-full mb-2">
                            <span className="font-bold text-accent text-lg font-rounded">
                                {format(result.date, 'M/d (E)', { locale })}
                            </span>
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${result.status === 'open'
                                ? 'bg-green-100 text-green-700 border-green-200'
                                : result.status === 'closed'
                                    ? 'bg-slate-100 text-slate-500 border-slate-200'
                                    : 'bg-pink-100 text-pink-700 border-pink-200'
                                }`}>
                                {result.status}
                            </span>
                        </div>

                        <div className="flex items-center gap-2 text-calm-subtext text-xs mb-1">
                            <MapPin size={12} />
                            <span className="truncate">{result.facilityName}</span>
                        </div>

                        <div className="font-bold text-calm-text text-sm group-hover:text-accent transition-colors line-clamp-2">
                            {result.eventName}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};
