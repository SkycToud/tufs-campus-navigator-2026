import React, { useState, useEffect } from 'react';
import { DateSelector } from './DateSelector';
import { FacilityCard } from './FacilityCard';
import { AdminBuildingCard } from './AdminBuildingCard';
import { type FacilityId } from '../lib/schedules';
import { useLanguage } from '../contexts/LanguageContext';
import { FacilityCalendarModal } from './FacilityCalendarModal';
import { DebugTimeBanner } from './DebugTimeBanner';
import { useSearchContext } from '../contexts/SearchContext';
import { useSearch } from '../hooks/useSearch';
import { getNowJST } from '../lib/date';
import { Search } from 'lucide-react';


export const Dashboard: React.FC = () => {
    const [date, setDate] = useState(getNowJST());
    const { t } = useLanguage();
    const { selectedEvent, setSelectedEvent } = useSearchContext();
    const { query, filteredFacilityIds } = useSearch();

    const [selectedFacility, setSelectedFacility] = useState<FacilityId | null>(null);

    // Initial Date for Modal
    const [modalInitialDate, setModalInitialDate] = useState<Date | undefined>(undefined);

    // Watch for selected event from dropdown (SearchContext)
    useEffect(() => {
        if (selectedEvent) {
            setModalInitialDate(selectedEvent.date);
            setSelectedFacility(selectedEvent.facilityId);
            // Clear selection immediately so it can be re-selected if needed? 
            // Or keep it. If we clear it, effect won't run again unless set again.
            // Better to clear it after consuming?
            // But if we clear it, maybe dropdown doesn't know it's selected. 
            // Actually dropdown doesn't show selection state.
            setSelectedEvent(null);
        }
    }, [selectedEvent, setSelectedEvent]);


    // Helper to check visibility
    const isVisible = (id: FacilityId) => {
        if (!query) return true;
        return filteredFacilityIds?.includes(id);
    }

    // Define groups for section visibility check
    const mainFacilities: FacilityId[] = ['lecture_bldg', 'library', 'circle_bldg', 'agora_global'];
    const shopFacilities: FacilityId[] = ['cafeteria_1f', 'store', 'sabor_2f'];
    const adminFacilities: FacilityId[] = ['admin_bldg', 'academic_affairs', 'admission', 'accounting']; // Check all for AdminCard visibility

    const showMainSection = isVisible('university_events') || mainFacilities.some(isVisible);
    const showShopSection = shopFacilities.some(isVisible);
    // Admin card itself handles sub-depts, but for dashboard visibility we check if any related ID is matched.
    // Also 'cert_machine' is in admin section.
    const showAdminSection = adminFacilities.some(isVisible) || isVisible('cert_machine');

    // Check if NO results
    const isNotFound = query && !showMainSection && !showShopSection && !showAdminSection;

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-screen-lg mx-auto min-h-[60vh]">
            <DebugTimeBanner />
            <div className="flex flex-col sm:flex-row sm:justify-center sm:items-center mb-6">
                <DateSelector currentDate={date} onDateChange={setDate} />
            </div>

            {isNotFound ? (
                <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in-95 duration-200">
                    <div className="bg-slate-100 p-4 rounded-full mb-4">
                        <Search size={32} className="text-calm-subtext" />
                    </div>
                    <h3 className="text-lg font-bold text-calm-text mb-2">
                        {t('status.unknown') === 'Unknown' ? 'No facilities found' : '見つかりませんでした'}
                    </h3>
                    <p className="text-calm-subtext text-sm">
                        "{query}" に一致する施設はありません
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    {/* Main Facilities Section */}
                    {showMainSection && (
                        <section className="space-y-4 animate-in slide-in-from-bottom-2 duration-300">
                            {isVisible('university_events') && (
                                <FacilityCard
                                    facilityId="university_events"
                                    date={date}
                                    onClick={() => setSelectedFacility('university_events')}
                                />
                            )}
                            {mainFacilities.some(isVisible) && (
                                <h2 className="text-sm font-bold text-calm-subtext uppercase tracking-wider pl-2 mt-6">
                                    {t('section.main_facilities')}
                                </h2>
                            )}
                            <div className="grid gap-3">
                                {mainFacilities.map(id => isVisible(id) && (
                                    <FacilityCard
                                        key={id}
                                        facilityId={id}
                                        date={date}
                                        onClick={() => setSelectedFacility(id)}
                                    />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Shops Section */}
                    {showShopSection && (
                        <section className="space-y-4 animate-in slide-in-from-bottom-3 duration-300">
                            <h2 className="text-sm font-bold text-calm-subtext uppercase tracking-wider pl-2">{t('section.shops_services')}</h2>
                            {isVisible('cafeteria_1f') && (
                                <FacilityCard facilityId="cafeteria_1f" date={date} onClick={() => setSelectedFacility('cafeteria_1f')} />
                            )}
                            <div className="grid grid-cols-1 gap-3">
                                {isVisible('store') && (
                                    <FacilityCard facilityId="store" date={date} onClick={() => setSelectedFacility('store')} />
                                )}
                                {isVisible('sabor_2f') && (
                                    <FacilityCard facilityId="sabor_2f" date={date} onClick={() => setSelectedFacility('sabor_2f')} />
                                )}
                            </div>
                        </section>
                    )}

                    {/* Admin Section */}
                    {showAdminSection && (
                        <section className="space-y-4 animate-in slide-in-from-bottom-4 duration-300">
                            <h2 className="text-sm font-bold text-calm-subtext uppercase tracking-wider pl-2">{t('section.administration')}</h2>
                            {adminFacilities.some(isVisible) && (
                                <AdminBuildingCard date={date} onSelectFacility={setSelectedFacility} />
                            )}
                            {isVisible('cert_machine') && (
                                <FacilityCard facilityId="cert_machine" date={date} onClick={() => setSelectedFacility('cert_machine')} />
                            )}
                        </section>
                    )}
                </div>
            )}

            <div className="h-8" />

            {selectedFacility && (
                <FacilityCalendarModal
                    facilityId={selectedFacility}
                    isOpen={!!selectedFacility}
                    onClose={() => setSelectedFacility(null)}
                    initialDate={modalInitialDate}
                />
            )}

        </div>
    );
}
