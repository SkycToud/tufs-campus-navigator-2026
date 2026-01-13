import React, { useState } from 'react';
import { DateSelector } from './DateSelector';
import { FacilityCard } from './FacilityCard';
import { AdminBuildingCard } from './AdminBuildingCard';
import { type FacilityId } from '../lib/schedules';
import { useLanguage } from '../contexts/LanguageContext';
import { FacilityCalendarModal } from './FacilityCalendarModal';
import { DebugTimeBanner } from './DebugTimeBanner';

import { getNowJST } from '../lib/date';

export const Dashboard: React.FC = () => {
    const [date, setDate] = useState(getNowJST());
    const { t } = useLanguage();

    const [selectedFacility, setSelectedFacility] = useState<FacilityId | null>(null);

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-screen-lg mx-auto">
            <DebugTimeBanner />
            <div className="flex flex-col sm:flex-row sm:justify-center sm:items-center mb-6">
                <DateSelector currentDate={date} onDateChange={setDate} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <section className="space-y-4">
                    <h2 className="text-sm font-bold text-calm-subtext uppercase tracking-wider pl-2">{t('section.main_facilities')}</h2>
                    <div className="grid gap-3">
                        <FacilityCard
                            facilityId="university_events"
                            date={date}
                            onClick={() => setSelectedFacility('university_events')}
                        />
                        <FacilityCard
                            facilityId="lecture_bldg"
                            date={date}
                            onClick={() => setSelectedFacility('lecture_bldg')}
                        />
                        <FacilityCard
                            facilityId="library"
                            date={date}
                            onClick={() => setSelectedFacility('library')}
                        />
                        <FacilityCard
                            facilityId="circle_bldg"
                            date={date}
                            onClick={() => setSelectedFacility('circle_bldg')}
                        />
                        <FacilityCard
                            facilityId="agora_global"
                            date={date}
                            onClick={() => setSelectedFacility('agora_global')}
                        />
                    </div>
                </section>

                <section className="space-y-4">
                    <h2 className="text-sm font-bold text-calm-subtext uppercase tracking-wider pl-2">{t('section.shops_services')}</h2>
                    <FacilityCard facilityId="cafeteria_1f" date={date} onClick={() => setSelectedFacility('cafeteria_1f')} />
                    <div className="grid grid-cols-1 gap-3">
                        <FacilityCard facilityId="store" date={date} onClick={() => setSelectedFacility('store')} />
                        <FacilityCard facilityId="sabor_2f" date={date} onClick={() => setSelectedFacility('sabor_2f')} />
                    </div>
                    <FacilityCard facilityId="cafe_castalia" date={date} onClick={() => setSelectedFacility('cafe_castalia')} />
                </section>

                <section className="space-y-4">
                    <h2 className="text-sm font-bold text-calm-subtext uppercase tracking-wider pl-2">{t('section.administration')}</h2>
                    <AdminBuildingCard date={date} onSelectFacility={setSelectedFacility} />
                    <FacilityCard facilityId="cert_machine" date={date} onClick={() => setSelectedFacility('cert_machine')} />
                </section>
            </div>

            <div className="h-8" />

            {selectedFacility && (
                <FacilityCalendarModal
                    facilityId={selectedFacility}
                    isOpen={!!selectedFacility}
                    onClose={() => setSelectedFacility(null)}
                />
            )}

        </div>
    );
}
