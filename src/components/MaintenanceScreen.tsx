import React from 'react';
import { AlertTriangle, ExternalLink } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const MaintenanceScreen: React.FC = () => {
    const { t } = useLanguage();

    React.useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-500">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center space-y-6">
                <div className="flex justify-center">
                    <div className="p-4 bg-amber-100 rounded-full animate-pulse">
                        <AlertTriangle size={48} className="text-amber-500" />
                    </div>
                </div>

                <div className="space-y-3">
                    <h1 className="text-xl font-bold text-gray-900">
                        {t('maintenance.title')}
                    </h1>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        {t('maintenance.text')}
                    </p>
                </div>

                <div className="pt-2">
                    <a
                        href="https://www.tufs.ac.jp/student/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 bg-accent text-white font-bold rounded-xl hover:bg-accent/90 transition-transform active:scale-95 shadow-md shadow-accent/20"
                    >
                        <span>{t('maintenance.official_site')}</span>
                        <ExternalLink size={18} />
                    </a>
                </div>
            </div>
        </div>
    );
};
