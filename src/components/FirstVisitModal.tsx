import React, { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { AlertTriangle, Check } from 'lucide-react';

export const FirstVisitModal: React.FC = () => {
    const { t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Check if user has visited before
        const hasVisited = localStorage.getItem('tufs-nav-visited-beta');
        if (!hasVisited) {
            setIsOpen(true);
        }
    }, []);

    const handleClose = () => {
        localStorage.setItem('tufs-nav-visited-beta', 'true');
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Decorative top bar */}
                <div className="h-2 bg-gradient-to-r from-amber-400 to-amber-500" />

                <div className="p-6">
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="p-3 bg-amber-50 rounded-full text-amber-500 mb-2">
                            <AlertTriangle size={32} />
                        </div>

                        <h2 className="text-xl font-bold text-slate-800">
                            {t('first_visit.title')}
                        </h2>

                        <p className="text-slate-600 text-sm leading-relaxed">
                            {t('first_visit.text')}
                        </p>

                        <div className="flex gap-3 mt-4 w-full">
                            <button
                                onClick={() => window.history.back()}
                                className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-colors"
                            >
                                {t('first_visit.disagree')}
                            </button>
                            <button
                                onClick={handleClose}
                                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors"
                            >
                                <span>{t('first_visit.agree')}</span>
                                <Check size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
