import React from 'react';
import { format } from 'date-fns';
import { ja, enUS } from 'date-fns/locale';
import { useSearchContext } from '../contexts/SearchContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useEventSearch, type SearchResult } from '../hooks/useEventSearch';
import { MapPin } from 'lucide-react';

export const SearchDropdown: React.FC = () => {
    const { query, setQuery, setSelectedEvent } = useSearchContext();
    const eventResults = useEventSearch();
    const { language } = useLanguage();
    const locale = language === 'ja' ? ja : enUS;

    // If no query or no results, don't show
    // Wait, if query exists but no results, maybe show "No results"?
    // Google Calendar shows "No results found" or similar.
    // Let's hide if no query.
    if (!query.trim()) return null;

    const handleSelect = (result: SearchResult) => {
        setSelectedEvent({
            facilityId: result.facilityId,
            date: result.date
        });
        setQuery(''); // Clear search on select
    };

    return (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-[100] max-h-[60vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            {eventResults.length === 0 ? (
                <div className="p-4 text-center text-sm text-gray-500">
                    {language === 'ja' ? '一致するイベントはありません' : 'No events found'}
                </div>
            ) : (
                <div className="py-2">
                    {eventResults.map((result, index) => (
                        <button
                            key={`${result.facilityId}-${result.date.getTime()}-${index}`}
                            onClick={() => handleSelect(result)}
                            className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3 group border-b border-gray-50 last:border-0"
                        >
                            <div className="flex-shrink-0 flex flex-col items-center justify-center bg-gray-100 rounded-md w-10 h-10 text-gray-600 group-hover:bg-accent group-hover:text-white transition-colors">
                                <span className="text-[10px] font-bold uppercase leading-none">
                                    {format(result.date, 'MMM', { locale })}
                                </span>
                                <span className="text-sm font-bold leading-none mt-0.5">
                                    {format(result.date, 'd', { locale })}
                                </span>
                            </div>

                            <div className="flex-grow min-w-0">
                                <div className="font-medium text-gray-900 group-hover:text-accent truncate transition-colors">
                                    {result.eventName}
                                </div>
                                <div className="text-xs text-gray-500 flex items-center gap-1 truncate">
                                    <MapPin size={10} />
                                    {result.facilityName}
                                    <span className={`ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${result.status === 'open' ? 'bg-green-100 text-green-700' :
                                        result.status === 'closed' ? 'bg-slate-100 text-slate-500' :
                                            'bg-pink-100 text-pink-700'
                                        }`}>
                                        {result.status}
                                    </span>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
