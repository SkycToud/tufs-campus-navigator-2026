import React from 'react';

import { Languages, Info } from 'lucide-react';
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


                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsAboutOpen(true)}
                        className="p-2 rounded-full hover:bg-white/40 active:bg-white/60 transition-colors text-calm-subtext hover:text-accent"
                        aria-label="About"
                    >
                        <Info size={20} />
                    </button>
                    <button
                        onClick={() => setLanguage(language === 'ja' ? 'en' : 'ja')}
                        className="p-2 rounded-full hover:bg-white/40 active:bg-white/60 transition-colors text-calm-subtext hover:text-accent flex items-center gap-1.5"
                    >
                        <Languages size={20} />
                        <span className="text-sm font-bold tabular-nums">{language.toUpperCase()}</span>
                    </button>
                </div>
            </header >

            <main className="relative z-10 p-4 pb-20 max-w-7xl mx-auto w-full">
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
