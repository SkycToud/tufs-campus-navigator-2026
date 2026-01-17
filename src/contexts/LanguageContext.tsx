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
    'status.open_main': { ja: '開館', en: 'Open' },
    'status.closed_main': { ja: '閉館', en: 'Closed' },
    'status.break': { ja: '休憩中', en: 'On Break' },
    'status.closing_soon': { ja: 'もうすぐ終了', en: 'Closing Soon' },
    'status.unknown': { ja: '不明', en: 'Unknown' },
    'status.unpublished': { ja: '公開前', en: 'Unpublished' },
    'status.opens_at': { ja: '開館', en: 'Opens at' },
    'status.closes_at': { ja: '閉館', en: 'Closes at' },
    'status.opens_at_shop': { ja: '開店', en: 'Opens at' },
    'status.closes_at_shop': { ja: '閉店', en: 'Closes at' },
    'status.closed_shop': { ja: '営業時間外', en: 'Closed' },
    'status.no_note_plain': { ja: '特記事項なし', en: 'No special notes' },

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
    'note.short_hours': { ja: '短縮営業', en: 'Short Hours' },
    'note.common_test': { ja: '共通テスト（入構制限）', en: 'Common Test (Restricted Entry)' },
    'note.closed_period': { ja: '期間外閉店', en: 'Closed during this period' },
    'note.new_year_holiday': { ja: '年始休館', en: "New Year's Holiday" },
    'note.entrance_exam': { ja: '二次試験日', en: 'Entrance Exam' },
    'note.designated_closed': { ja: '指定休館日', en: 'Designated Closed Day' },
    'note.regular_holiday': { ja: '定休日', en: 'Regular Holiday' },
    'note.includes_holiday': { ja: '祝日含む', en: 'Includes Holiday' },
    'note.national_holiday': { ja: '祝日', en: 'National Holiday' },
    'note.meal_provides': { ja: '食事メニュー提供', en: 'Meal Service Available' },
    'note.fresh_bread': { ja: '焼き立てパン販売', en: 'Freshly Baked Bread Sales' },
    'note.class_cancellation': { ja: '全学臨時休講', en: 'University-wide Class Cancellation' },
    'note.class_cancellation_restricted': { ja: '全学臨時休講（入構制限）', en: 'University-wide Class Cancellation (Restricted Entry)' },
    'note.sabor_special': { ja: '11:00-13:00（食事メニュー提供）、11:00-14:30（焼き立てパン販売）', en: '11:00-13:00 (Meal Service), 11:00-14:30 (Fresh Bread)' },

    // About Page
    'about.title': { ja: 'アプリについて', en: 'About' },
    // About Sections
    'about.section.about.title': { ja: '本アプリについて', en: 'About App' },
    'about.section.about.content': { ja: '本アプリは、個人が開発・運営を行っている非公式のサービスです。', en: 'This is an unofficial service developed and operated by an individual.' },

    'about.section.accuracy.title': { ja: '情報の正確性について', en: 'Data Accuracy' },
    'about.section.accuracy.content': {
        ja: '本アプリは、大学公式サイト等の外部データを参照し、独自のロジックを用いて情報を表示しています。システムの運用には万全を期しておりますが、元データの更新遅延や学事予定の急な変更により、実際の状況と異なる情報が表示される可能性があります。あらかじめご了承ください。',
        en: 'This app references external data (official university websites, etc.) and uses custom logic to display information. While we strive to ensure system accuracy, please note that information may differ from actual status due to delays in data updates or sudden changes in academic schedules.'
    },

    'about.section.official.title': { ja: '公式サイトの確認', en: 'Official Verification' },
    'about.section.official.content': {
        ja: '重要な予定や正確な時間を確認する必要がある場合は、必ず各施設・大学の公式サイトおよび掲示板を併せてご確認ください。',
        en: 'For important schedules or precise times, please ensure to check the official websites and bulletin boards of each facility/university.'
    },

    'about.section.disclaimer.title': { ja: '免責事項', en: 'Disclaimer' },
    'about.section.disclaimer.content': {
        ja: '本アプリの利用により生じた不利益や損害について、開発者は一切の責任を負いかねます。利用者自身の判断と責任においてご利用ください。',
        en: 'The developer assumes no responsibility for any disadvantages or damages arising from the use of this app. Please use it at your own discretion and responsibility.'
    },
    'about.last_updated': { ja: 'データ最終更新日', en: 'Data Last Updated' },
    'about.stale_warning': { ja: '※古い情報が含まれている可能性があります', en: '※Data may be outdated' },
    'about.official_links': { ja: '公式サイト', en: 'Official Links' },

    // Maintenance
    'maintenance.title': { ja: 'サービス一時停止中', en: 'Service Temporarily Suspended' },
    'maintenance.text': { ja: '現在、データの調整中のためサービスを一時停止しています。正確な情報は公式サイトを確認してください。', en: 'The service is currently suspended for data adjustment. Please check the official website for accurate information.' },
    'maintenance.official_site': { ja: '公式サイトを確認', en: 'Check Official Website' },
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
    'first_visit.text': { ja: '本アプリは外部データを参照しています。取得タイミングや元データの公開状況により、正確性を保証できない場合があります。', en: 'This app references external data. Accuracy cannot be guaranteed depending on data retrieval timing or availability.' },
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
