import React, { useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { DATA_LAST_UPDATED } from '../lib/schedules';
import { X, ExternalLink, Info, AlertTriangle, ShieldAlert, Globe } from 'lucide-react';

interface AboutModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
    const { t, language } = useLanguage();
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

    const SECTIONS = [
        {
            icon: Info,
            titleKey: 'about.section.about.title',
            contentKey: 'about.section.about.content'
        },
        {
            icon: AlertTriangle,
            titleKey: 'about.section.accuracy.title',
            contentKey: 'about.section.accuracy.content'
        },
        {
            icon: Globe,
            titleKey: 'about.section.official.title',
            contentKey: 'about.section.official.content'
        },
        {
            icon: ShieldAlert,
            titleKey: 'about.section.disclaimer.title',
            contentKey: 'about.section.disclaimer.content'
        }
    ];

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
                <div className="p-6 overflow-y-auto space-y-8">
                    {/* Sections */}
                    <div className="space-y-6">
                        {SECTIONS.map((section, i) => (
                            <div key={i} className="flex gap-4">
                                <div className="mt-0.5 shrink-0">
                                    <section.icon className="w-5 h-5 text-calm-subtext" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-xs font-bold text-calm-subtext uppercase tracking-wider">
                                        {t(section.titleKey)}
                                    </h3>
                                    <p className="text-sm text-calm-text leading-relaxed">
                                        {t(section.contentKey)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Links */}
                    <div className="space-y-3 pt-2 border-t border-slate-100">
                        <h3 className="text-xs font-bold text-calm-subtext uppercase tracking-wider mt-4">
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

                    <div className="pt-4 text-center space-y-2 border-t border-slate-100">
                        <div className="text-xs text-slate-500">
                            {t('about.last_updated')}: {new Date(DATA_LAST_UPDATED).toLocaleDateString(language === 'ja' ? 'ja-JP' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                        {/* Stale Data Warning (older than 1 month) */}
                        {new Date() > new Date(new Date(DATA_LAST_UPDATED).setMonth(new Date(DATA_LAST_UPDATED).getMonth() + 1)) && (
                            <p className="text-xs font-bold" style={{ color: '#ee5599' }}>
                                {t('about.stale_warning')}
                            </p>
                        )}
                        <p className="text-xs text-slate-400">
                            たふスケ運営チーム
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
