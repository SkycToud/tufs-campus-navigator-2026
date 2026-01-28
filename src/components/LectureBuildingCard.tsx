import React from 'react';
import { type FacilityId, CONST_SCHEDULE_DATA } from '../lib/schedules';
import { useLanguage } from '../contexts/LanguageContext';
import { useFacilityStatus } from '../hooks/useFacilityStatus';
import { useSearch } from '../hooks/useSearch';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface SubDepartmentProps {
    id: FacilityId;
    date: Date;
    onClick: () => void;
}

const STATUS_Styles = {
    open: { bg: 'bg-emerald-50/80', text: 'text-emerald-700', dot: 'bg-emerald-500', border: 'border-emerald-200' },
    closing_soon: { bg: 'bg-amber-50/80', text: 'text-amber-700', dot: 'bg-amber-500', border: 'border-amber-200' },
    break: { bg: 'bg-yellow-50/80', text: 'text-yellow-700', dot: 'bg-yellow-500', border: 'border-yellow-200' },
    closed: { bg: 'bg-slate-50/50', text: 'text-slate-500', dot: 'bg-slate-400', border: 'border-slate-100' },
};

const SubDepartment: React.FC<SubDepartmentProps> = ({ id, date, onClick }) => {
    const { language } = useLanguage();
    const facility = CONST_SCHEDULE_DATA[id];
    const { status, statusText } = useFacilityStatus(id, date);

    const name = language === 'ja' ? facility.name : facility.nameEn;
    const style = STATUS_Styles[status] || STATUS_Styles.closed;

    return (
        <button
            onClick={onClick}
            className="w-full flex items-center justify-between p-3 pl-4 border-t border-slate-50 hover:bg-slate-50/50 transition-colors group text-left"
        >
            <span className="text-sm font-medium text-calm-text group-hover:text-accent transition-colors">
                {name}
            </span>
            <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${style.bg} ${style.text} ${style.border}`}>
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`} />
                <span className="leading-tight text-right">
                    {statusText.split(', ').map((part, index, array) => (
                        <React.Fragment key={index}>
                            {part}
                            {index < array.length - 1 && (
                                <>
                                    ,<br className="hidden sm:inline" />
                                </>
                            )}
                        </React.Fragment>
                    ))}
                </span>
            </div>
        </button>
    );
};

interface LectureBuildingCardProps {
    date: Date;
    onSelectFacility: (id: FacilityId) => void;
}

export const LectureBuildingCard: React.FC<LectureBuildingCardProps> = ({ date, onSelectFacility }) => {
    const { language } = useLanguage();
    const { query, filteredFacilityIds } = useSearch();
    const [isExpanded, setIsExpanded] = React.useState(false);

    const mainId: FacilityId = 'lecture_bldg';
    const mainFacility = CONST_SCHEDULE_DATA[mainId];

    // Sub-facility IDs to check for auto-expansion
    const subFacilityIds: FacilityId[] = ['global_career_center', 'tufs_support'];

    // Auto-expand if search matches sub-facilities
    React.useEffect(() => {
        if (query && filteredFacilityIds) {
            const hasMatch = subFacilityIds.some(id => filteredFacilityIds.includes(id));
            if (hasMatch) {
                setIsExpanded(true);
            }
        }
    }, [query, filteredFacilityIds]);

    const { status, statusText } = useFacilityStatus(mainId, date);
    const style = STATUS_Styles[status] || STATUS_Styles.closed;
    const mainName = language === 'ja' ? mainFacility.name : mainFacility.nameEn;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            {/* Main Building Header - Clickable for Lecture Building */}
            <div className="w-full flex items-center justify-between p-4 bg-slate-50/30">
                <button
                    onClick={() => onSelectFacility(mainId)}
                    className="flex-grow text-left group flex justify-between items-center"
                >
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-calm-text text-base group-hover:text-accent transition-colors">
                                {mainName}
                            </h3>
                            {/* Status Badge */}
                            <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${style.bg} ${style.text} ${style.border}`}>
                                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`} />
                                <span>{statusText}</span>
                            </div>
                        </div>
                    </div>
                </button>

                {/* Toggle Button */}
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-2 ml-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-calm-text transition-colors"
                >
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
            </div>

            {/* Sub Departments List - Animated/Conditional */}
            {isExpanded && (
                <div className="flex flex-col animate-in slide-in-from-top-2 duration-200">
                    <SubDepartment id="global_career_center" date={date} onClick={() => onSelectFacility('global_career_center')} />
                    <SubDepartment id="tufs_support" date={date} onClick={() => onSelectFacility('tufs_support')} />
                </div>
            )}
        </div>
    );
};
