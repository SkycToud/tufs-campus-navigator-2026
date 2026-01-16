import React from 'react';
import { type FacilityId, CONST_SCHEDULE_DATA } from '../lib/schedules';
import { useLanguage } from '../contexts/LanguageContext';
import { useFacilityStatus } from '../hooks/useFacilityStatus';

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

interface AdminBuildingCardProps {
    date: Date;
    onSelectFacility: (id: FacilityId) => void;
}

export const AdminBuildingCard: React.FC<AdminBuildingCardProps> = ({ date, onSelectFacility }) => {
    const { language } = useLanguage();
    const mainId: FacilityId = 'admin_bldg';
    const mainFacility = CONST_SCHEDULE_DATA[mainId];
    const mainName = language === 'ja' ? mainFacility.name : mainFacility.nameEn;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            {/* Main Building Header */}
            <button
                onClick={() => onSelectFacility(mainId)}
                className="w-full p-4 bg-slate-50/30 text-left hover:bg-slate-50 transition-colors group"
            >
                <div className="flex justify-between items-center mb-1">
                    <h3 className="font-bold text-calm-text text-base group-hover:text-accent transition-colors">
                        {mainName}
                    </h3>
                    <span className="text-calm-subtext">
                        {/* Status hidden as requested */}
                    </span>
                </div>
            </button>

            {/* Sub Departments List */}
            <div className="flex flex-col">
                <SubDepartment id="academic_affairs" date={date} onClick={() => onSelectFacility('academic_affairs')} />
                <SubDepartment id="admission" date={date} onClick={() => onSelectFacility('admission')} />
                <SubDepartment id="accounting" date={date} onClick={() => onSelectFacility('accounting')} />
            </div>
        </div>
    );
};
