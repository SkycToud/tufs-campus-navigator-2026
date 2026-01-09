import React from 'react';

import { Languages, Info, Menu, X, MessageSquare } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { AboutModal } from './AboutModal';
import { FirstVisitModal } from './FirstVisitModal';

import { useMaintenance, MaintenanceProvider } from '../contexts/MaintenanceContext';

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <MaintenanceProvider>
            <LayoutContent>{children}</LayoutContent>
        </MaintenanceProvider>
    );
}

function LayoutContent({ children }: { children: React.ReactNode }) {
    const { language, setLanguage } = useLanguage();
    const { isMaintenanceMode, setMaintenanceMode } = useMaintenance();
    const [isAboutOpen, setIsAboutOpen] = React.useState(false);
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    // Hidden trigger: Triple click on logo
    const handleLogoClick = (e: React.MouseEvent) => {
        if (e.detail === 3) {
            setMaintenanceMode(!isMaintenanceMode);
            console.log('Maintenance Mode Toggled via Logo Triple Click');
        }
    };

    return (
        <div className="min-h-screen w-full bg-calm-bg text-calm-text font-sans selection:bg-accent/20 selection:text-accent">
            {/* Background Decorative Blur - Softer warm tones */}
            <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-orange-100/40 rounded-full blur-3xl pointer-events-none" />
            <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-rose-100/40 rounded-full blur-3xl pointer-events-none" />

            <header className="sticky top-0 z-50 glass border-b border-white/40 px-4 py-3 flex items-center justify-between">
                <div
                    className="flex items-center gap-2 cursor-pointer select-none"
                    onClick={handleLogoClick}
                >
                    <div className="overflow-hidden">
                        <div
                            className="w-10 h-10"
                            style={{
                                backgroundImage: 'url(/logo.png)',
                                backgroundSize: 'contain',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat'
                            }}
                        />
                    </div>
                    <div className="leading-none">
                        <h1 className="text-lg font-bold text-calm-text font-rounded">
                            たふスケ
                        </h1>
                        <span className="block text-xs font-normal text-calm-subtext tracking-wider">
                            TUFSche
                        </span>
                    </div>
                </div>


                <div className="relative">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="p-2 rounded-full hover:bg-white/40 active:bg-white/60 transition-colors text-calm-subtext hover:text-accent"
                        aria-label="Menu"
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    {/* Accordion / Dropdown Menu */}
                    {isMenuOpen && (
                        <div className="absolute right-0 top-full mt-2 w-56 bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-2 flex flex-col gap-1 animate-in fade-in slide-in-from-top-2 duration-200">
                            {/* Language Switcher */}
                            <button
                                onClick={() => {
                                    setLanguage(language === 'ja' ? 'en' : 'ja');
                                    setIsMenuOpen(false);
                                }}
                                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/60 transition-colors text-left group"
                            >
                                <div className="flex items-center gap-3 text-calm-text group-hover:text-accent">
                                    <Languages size={18} />
                                    <span className="text-sm font-bold">Language</span>
                                </div>
                                <span className="text-xs font-bold bg-white/50 px-2 py-1 rounded-md text-calm-subtext uppercase tracking-wider">
                                    {language}
                                </span>
                            </button>

                            <div className="h-px bg-slate-100 mx-2 my-1" />

                            {/* About App */}
                            <button
                                onClick={() => {
                                    setIsAboutOpen(true);
                                    setIsMenuOpen(false);
                                }}
                                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/60 transition-colors text-left text-calm-text hover:text-accent"
                            >
                                <Info size={18} />
                                <span className="text-sm font-bold">About App</span>
                            </button>

                            {/* Feedback */}
                            <a
                                href="https://forms.gle/uh138thkJKN5MNdy6"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/60 transition-colors text-left text-calm-text hover:text-accent"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <MessageSquare size={18} />
                                <span className="text-sm font-bold">Feedback</span>
                            </a>
                        </div>
                    )}
                </div>
            </header >

            <main className="relative z-10 p-4 pb-10 max-w-7xl mx-auto w-full">
                {children}
            </main>

            <AboutModal
                isOpen={isAboutOpen}
                onClose={() => setIsAboutOpen(false)}
            />

            <FirstVisitModal />
        </div >
    );
}
