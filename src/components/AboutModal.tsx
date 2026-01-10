import React, { useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { X, ExternalLink, Info } from 'lucide-react';

interface AboutModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
    const { t } = useLanguage();
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />
            <div
                ref={modalRef}
                className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white sticky top-0 z-10">
                    <div className="flex items-center gap-2 text-calm-text">
                        <Info className="w-5 h-5 text-calm-subtext" />
                        <h2 className="text-lg font-bold">{t('about.title')}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 -mr-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto space-y-6">
                    {/* Disclaimer */}
                    <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl space-y-2">
                        <h3 className="text-sm font-bold text-amber-800 flex items-center gap-2">
                            {t('about.disclaimer_title')}
                        </h3>
                        <p className="text-sm text-amber-700 leading-relaxed whitespace-pre-wrap">
                            {t('about.disclaimer_text')}
                        </p>
                    </div>

                    {/* Links */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-bold text-calm-subtext uppercase tracking-wider">
                            {t('about.official_links')}
                        </h3>
                        <div className="grid gap-2">
                            <a
                                href="https://www.tufs.ac.jp/library/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 text-calm-text transition-colors group"
                            >
                                <span className="font-medium text-sm">{t('facility.library')}</span>
                                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-calm-text transition-colors" />
                            </a>
                            <a
                                href="https://www.univcoop.jp/tufs/time/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 text-calm-text transition-colors group"
                            >
                                <span className="font-medium text-sm">{t('about.coop')}</span>
                                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-calm-text transition-colors" />
                            </a>
                            <a
                                href="https://www.tufs.ac.jp/student/calendar/index.html"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 text-calm-text transition-colors group"
                            >
                                <span className="font-medium text-sm">{t('about.admin_calendar')}</span>
                                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-calm-text transition-colors" />
                            </a>
                            <a
                                href="https://www.tufs.ac.jp/student/procedure/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 text-calm-text transition-colors group"
                            >
                                <span className="font-medium text-sm">{t('about.student_procedures')}</span>
                                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-calm-text transition-colors" />
                            </a>
                        </div>
                    </div>

                    <div className="pt-4 text-center">
                        <p className="text-xs text-slate-400">
                            TUFS Campus Navigator 2026 (Beta)
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
