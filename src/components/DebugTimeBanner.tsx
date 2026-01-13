import React, { useEffect, useState } from 'react';
import { isMockMode, getCurrentTime } from '../lib/date';
import { Clock } from 'lucide-react';
import { format } from 'date-fns';

export const DebugTimeBanner: React.FC = () => {
    const [isMock, setIsMock] = useState(false);
    const [mockTime, setMockTime] = useState<Date | null>(null);

    useEffect(() => {
        if (isMockMode()) {
            setIsMock(true);
            setMockTime(getCurrentTime());
        }
    }, []);

    if (!isMock || !mockTime) return null;

    return (
        <div className="bg-[#ee5599] text-white py-1.5 px-4 text-center text-xs font-bold flex items-center justify-center gap-2 shadow-md z-50 relative animate-pulse">
            <Clock size={14} />
            <span>【デバッグモード】時刻を固定中: {format(mockTime, 'yyyy-MM-dd HH:mm')}</span>
        </div>
    );
};
