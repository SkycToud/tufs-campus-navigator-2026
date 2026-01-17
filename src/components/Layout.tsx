import { useDebounce } from '../hooks/useDebounce';
import React, { useState, useEffect } from 'react';
import { Languages, Info, Menu, X, MessageSquare, Search } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { AboutModal } from './AboutModal';
import { FirstVisitModal } from './FirstVisitModal';
import { SearchProvider, useSearchContext } from '../contexts/SearchContext';
import { useMaintenance, MaintenanceProvider } from '../contexts/MaintenanceContext';
import { SearchDropdown } from './SearchDropdown';

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <MaintenanceProvider>
            <SearchProvider>
                <LayoutContent>{children}</LayoutContent>
            </SearchProvider>
        </MaintenanceProvider>
    );
}
const LayoutContent = ({ children }: { children: React.ReactNode }) => {
    const { language, setLanguage, t } = useLanguage();
    const { isMaintenanceMode, setMaintenanceMode } = useMaintenance();
    const { query, setQuery } = useSearchContext();
    const [isAboutOpen, setIsAboutOpen] = useState(false);
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Local state for immediate input feedback (buffer)
    const [inputValue, setInputValue] = useState(query);

    // Debounce the input value updates to the global query
    const debouncedQuery = useDebounce(inputValue, 300);

    // 1. Sync local input -> global query (debounced)
    // Only update if they differ, this propagates the user's typing to the app
    useEffect(() => {
        if (debouncedQuery !== query) {
            setQuery(debouncedQuery);
        }
    }, [debouncedQuery, query, setQuery]);

    // 2. Sync global query -> local input (external changes)
    // e.g. when a suggestion is clicked and query is set to empty string
    // We only update IF the local input is different from the NEW global query AND the global query wasn't just set by us
    // Actually, simpler: if query changes to '', reset input. 
    // Or simpler: always sync if query changes? No, that breaks typing if roundtrip is slow.
    // Standard pattern: Only sync if query is empty (reset) OR if query changed from OUTSIDE.
    // In our app, query only changes from:
    // a) SearchDropdown selection -> setQuery('')
    // b) X button -> setQuery('')
    // c) Typing -> setInputValue -> debounced -> setQuery

    // So if query becomes empty, we should clear input.
    useEffect(() => {
        if (query === '') {
            setInputValue('');
        }
    }, [query]);


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

            <header className="sticky top-0 z-50 glass border-b border-white/40 px-4 py-3 flex items-center justify-between gap-4">
                <div
                    className="flex items-center gap-2 cursor-pointer select-none shrink-0"
                    onClick={handleLogoClick}
                >
                    <div className="overflow-hidden">
                        <div
                            className="w-10 h-10"
                            style={{
                                backgroundImage: 'url(/icon_v2.png)',
                                backgroundSize: 'contain',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat'
                            }}
                        />
                    </div>
                    {!isSearchExpanded && !inputValue && (
                        <div className="leading-none hidden sm:block">
                            <h1 className="text-lg font-bold text-calm-text font-rounded">
                                たふスケ
                            </h1>
                            <span className="block text-xs font-normal text-calm-subtext tracking-wider">
                                TUFSche
                            </span>
                        </div>
                    )}
                </div>

                {/* Search Bar */}
                {!(isSearchExpanded || inputValue) ? (
                    <button
                        onClick={() => setIsSearchExpanded(true)}
                        className="p-2.5 rounded-full hover:bg-white/40 text-calm-subtext hover:text-accent transition-colors ml-auto mr-1"
                        aria-label="Search"
                    >
                        <Search size={22} />
                    </button>
                ) : (
                    <div className="flex-1 max-w-sm relative animate-in fade-in zoom-in-95 duration-200">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-calm-subtext pointer-events-none">
                            <Search size={18} />
                        </div>
                        <input
                            type="text"
                            value={inputValue || ''}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder=""
                            autoFocus
                            className="w-full bg-white/50 border border-white/40 rounded-xl py-2.5 pl-10 pr-10 text-sm text-calm-text placeholder:text-calm-subtext/70 focus:bg-white focus:ring-2 focus:ring-accent/20 focus:border-accent/30 transition-all outline-none shadow-sm"
                        />
                        <button
                            onClick={() => {
                                if (inputValue) {
                                    setInputValue('');
                                    setQuery(''); // Clear immediately for UX
                                } else {
                                    setIsSearchExpanded(false);
                                }
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-calm-subtext hover:text-calm-text p-0.5 rounded-full hover:bg-black/5 transition-colors"
                        >
                            <X size={14} />
                        </button>
                        <SearchDropdown />
                    </div>
                )}


                <div className="relative shrink-0">
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
                                }}
                                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/60 transition-colors text-left group"
                            >
                                <div className="flex items-center gap-3 text-calm-text group-hover:text-accent">
                                    <Languages size={18} />
                                    <span className="text-sm font-bold">{t('menu.language')}</span>
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
                                <span className="text-sm font-bold">{t('menu.about')}</span>
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
                                <span className="text-sm font-bold">{t('menu.feedback')}</span>
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
