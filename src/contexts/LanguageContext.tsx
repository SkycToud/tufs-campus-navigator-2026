import { createContext, useContext, useState, type ReactNode } from 'react';

export type Language = 'ja' | 'en';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const translations: Record<string, Record<Language, string>> = {
    // Header
    'app.title': { ja: 'TUFS Campus Navigator 2026', en: 'TUFS Campus Navigator 2026' },

    // Headers
    'section.student_hub': { ja: 'Student Hub', en: 'Student Hub' },
    'section.shops_services': { ja: 'Shops & Services', en: 'Shops & Services' },
    'section.administration': { ja: 'Administration', en: 'Administration' },

    // Status
    'status.open': { ja: '営業中', en: 'Open' },
    'status.closed': { ja: '営業時間外', en: 'Closed' },
    'status.break': { ja: '休憩中', en: 'On Break' },
    'status.closing_soon': { ja: 'もうすぐ終了', en: 'Closing Soon' },
    'status.unknown': { ja: '不明', en: 'Unknown' },
    'status.unpublished': { ja: '未公表', en: 'Unpublished' },
    'status.opens_at': { ja: '開館', en: 'Opens at' },
    'status.closes_at': { ja: '閉館', en: 'Closes at' },

    // DateSelector
    'date.today': { ja: '今日', en: 'Today' },
    'date.tomorrow': { ja: '明日', en: 'Tomorrow' },
    'date.select': { ja: '日付を選択', en: 'Select Date' },

    // Dashboard
    'dashboard.title': { ja: 'キャンパスナビ', en: 'Campus Navigator' },
    'section.main_facilities': { ja: '主要施設', en: 'Main Facilities' },

    // Facilities (Fallbacks if not in DB)
    'facility.library': { ja: '附属図書館', en: 'TUFS Library' }, // Updated
    'facility.admin': { ja: '大学事務局', en: 'Admin Office' },
    'facility.admin_bldg': { ja: '本部管理棟', en: 'Administration Building' },

    // Notes
    'note.lunch_only': { ja: '平日ランチのみ', en: 'Weekday Lunch Only' },
    'note.cash_until_15': { ja: '現金受付は15:00まで', en: 'Cash accepted until 15:00' },
    'note.indoor': { ja: '屋内施設', en: 'Indoor Facility' },
    'note.short_hours': { ja: '短縮開館', en: 'Short Hours' },
    'note.common_test': { ja: '共通テスト/月末休館', en: 'Closed for Common Test/Month-end' },
    'note.closed_period': { ja: '期間外閉店', en: 'Closed during this period' },

    // About Page
    'about.title': { ja: 'アプリについて', en: 'About' },
    'about.disclaimer_title': { ja: '免責事項 (Beta版)', en: 'Disclaimer (Beta)' },
    'about.disclaimer_text': {
        ja: '本アプリは個人が開発・運営する非公式のベータ版です。\n\nデータの正確性について: 本アプリは外部サイト（大学公式サイト等）のデータを参照し、独自のロジックで判定を行っています。そのため、元データが未公開の場合や、学事予定が急遽変更された場合、表示内容に誤りが生じる可能性が高いことをあらかじめご了承ください。\n\n公式サイトの確認: 重要な予定がある場合は、必ず各施設の公式サイトおよび掲示板を併せてご確認ください。\n\n責任の所在: 本アプリの利用により生じた不利益や損害について、開発者は一切の責任を負いかねます。',
        en: 'This is an unofficial beta app.\n\nData Accuracy: This app determines schedules based on external data (official sites, etc.) using custom logic. Please note that errors may occur if original data is unpublished or schedules change suddenly.\n\nOfficial Verification: For important events, please always verify with official websites and bulletin boards.\n\nLiability: The developer assumes no responsibility for any disadvantages or damages arising from the use of this app.'
    },
    'about.last_updated': { ja: 'データ最終更新日', en: 'Data Last Updated' },
    'about.stale_warning': { ja: '※古い情報が含まれている可能性があります', en: '※Data may be outdated' },
    'about.official_links': { ja: '公式サイト', en: 'Official Links' },
    'about.coop': { ja: '大学生協 (営業時間)', en: 'University Co-op' },
    'about.admin_calendar': { ja: '大学・教務・事務窓口', en: 'University Admin Calendar' },
    // Header Menu
    'menu.language': { ja: '言語', en: 'Language' },
    'menu.about': { ja: 'アプリについて', en: 'About App' },
    'menu.feedback': { ja: 'フィードバック・お問い合わせ', en: 'Feedback & Contacts' },

    // Student Procedures
    'about.student_procedures': { ja: '学生窓口の事務受付時間', en: 'Student Office Hours' },

    // First Visit Modal
    'first_visit.title': { ja: 'ご利用前の確認', en: 'Important Notice' },
    'first_visit.text': { ja: '本アプリは外部サイトのデータを参照しています。元データが未公開の場合は誤りが生じる可能性が高いことをご了承ください。', en: 'This app references data from external sites. Please note that errors are highly likely if the original data is unpublished.' },
    'first_visit.disagree': { ja: '了解しない', en: 'Disagree' },
    'first_visit.agree': { ja: '了解', en: 'Agree' },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>('ja');

    const t = (key: string): string => {
        const entry = translations[key];
        if (!entry) return key;
        return entry[language] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
