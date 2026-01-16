export type FacilityId =
    | 'library'
    | 'cafeteria_1f'
    | 'sabor_2f'
    | 'store'
    | 'academic_affairs'
    | 'admission'
    | 'accounting'
    | 'cert_machine'
    | 'circle_bldg'
    | 'lecture_bldg'
    | 'agora_global'
    | 'cafe_castalia'
    | 'admin_bldg'
    | 'university_events';

export type ScheduleRule = {
    type: 'weekday' | 'wednesday' | 'saturday' | 'sunday' | 'specific_date' | 'range' | 'national_holiday';
    dates?: string[]; // ISO YYYY-MM-DD
    startDate?: string;
    endDate?: string;
    hours: { start: string; end: string }[];
    note?: string;
    isClosed?: boolean;
};

export type FacilityData = {
    name: string;
    nameEn: string;
    category: 'facility' | 'admin';
    rules: ScheduleRule[];
    exceptions?: Record<string, { status: 'closed' | 'open'; reason?: string; hours?: { start: string; end: string }[] }>;
    unpublishedFrom?: string; // YYYY-MM-DD
};

// Helper Functions
const times = (start: string, end: string) => [{ start, end }];

const Rules = {
    // Basic Rule Generators
    date: (date: string, hours: { start: string; end: string }[], note?: string): ScheduleRule => ({
        type: 'specific_date', dates: [date], hours, note
    }),
    range: (startDate: string, endDate: string, hours: { start: string; end: string }[], note?: string): ScheduleRule => ({
        type: 'range', startDate, endDate, hours, note
    }),
    weekday: (hours: { start: string; end: string }[], note?: string): ScheduleRule => ({
        type: 'weekday', hours, note
    }),
    subWeekday: (type: 'wednesday' | 'saturday' | 'sunday', hours: { start: string; end: string }[], isClosed = false): ScheduleRule => ({
        type, hours, isClosed
    }),

    // Dynamic Rules
    nationalHoliday: (isClosed = true, note?: string): ScheduleRule => ({
        type: 'national_holiday', hours: [], isClosed, note: note || '祝日'
    }),

    // Shortcuts for Closed/Open
    closedDate: (date: string, note?: string): ScheduleRule => ({
        type: 'specific_date', dates: [date], hours: [], isClosed: true, note
    }),
    closedRange: (startDate: string, endDate: string, note?: string): ScheduleRule => ({
        type: 'range', startDate, endDate, hours: [], isClosed: true, note
    }),
    closedWeekends: (): ScheduleRule[] => [
        { type: 'saturday', hours: [], isClosed: true },
        { type: 'sunday', hours: [], isClosed: true }
    ]
};

// Common Hours
const HO = {
    DEFAULT: times('09:00', '20:00'),
    EARLY_LATE: times('07:00', '20:00'),
    LUNCH_STD: times('11:00', '14:30'),
    LUNCH_SHORT: times('11:00', '13:30'),
    LUNCH_EXAM: times('11:30', '13:30'),
    STORE_STD: times('11:00', '16:30'),
    STORE_SHORT: times('11:00', '15:00'),
    ADMIN_STD: times('09:00', '17:00'),
    ADMIN_LUNCH: [
        { start: '09:00', end: '12:40' },
        { start: '13:40', end: '16:30' }
    ],
    ADMISSION_LUNCH: [
        { start: '09:00', end: '12:00' },
        { start: '13:00', end: '17:00' }
    ]
};

// Common Admin Rules (Closed dates shared across all admin facilities)
const COMMON_ADMIN_RULES: ScheduleRule[] = [
    // Exceptions: New Year
    Rules.closedRange('2026-01-01', '2026-01-04', '年始休業'),

    // Automatic Holiday Rule
    Rules.nationalHoliday(true),

    // Weekends are closed
    ...Rules.closedWeekends(),
];

// 1. Define University Events Rules first
const UNIVERSITY_EVENTS_RULES: ScheduleRule[] = [
    Rules.date('2026-01-05', [], '授業再開'),
    Rules.date('2026-01-08', [], '履修登録･修正期間(冬学期)'),
    Rules.date('2026-01-09', [], '履修登録･修正期間(冬学期) / 卒業論文・卒業研究 提出締切'),
    Rules.date('2026-01-13', [], '金曜授業実施日'),
    Rules.date('2026-01-15', [], '秋学期授業終了'),
    Rules.date('2026-01-15', [], '秋学期授業終了'),
    Rules.closedDate('2026-01-16', 'note.class_cancellation_restricted'),
    Rules.closedRange('2026-01-17', '2026-01-18', 'note.class_cancellation_restricted'), // Simplified or use custom if strictly needed
    Rules.range('2026-01-19', '2026-01-23', [], '秋学期 定期試験期間'),
    Rules.date('2026-01-26', [], '冬学期 授業開始'),

    // February 2026
    Rules.date('2026-02-02', [], '秋学期成績Web閲覧開始(9:00) / 問い合わせ期間開始'),
    Rules.range('2026-02-03', '2026-02-05', [], '秋学期成績問い合わせ期間'),
    Rules.date('2026-02-06', [], '冬学期 授業終了 / 秋学期成績問い合わせ期限(~16:30)'),

    Rules.date('2026-02-16', [], '冬学期成績Web閲覧開始(9:00) / 問い合わせ期間開始'),
    Rules.range('2026-02-17', '2026-02-19', [], '冬学期成績問い合わせ期間'),
    Rules.date('2026-02-20', [], '冬学期成績問い合わせ期限(~16:30)'),

    Rules.closedDate('2026-02-24', 'note.class_cancellation_restricted'),
    Rules.closedDate('2026-02-25', '第2次学力試験（前期）/ 入構制限'),

    // March 2026
    Rules.closedRange('2026-03-11', '2026-03-12', 'note.class_cancellation_restricted'),
    Rules.date('2026-03-12', [], '第2次学力試験（後期）'),

    Rules.range('2026-03-11', '2026-03-20', [], '卒業者・進級者発表'), // Mid Mar (approx)
    Rules.date('2026-03-20', [], '卒業式（学位記授与式）'),
    Rules.date('2026-03-31', [], '学年終わり'),

    // Fallbacks
    Rules.weekday([], ''),
    Rules.subWeekday('saturday', [], false),
    Rules.subWeekday('sunday', [], false),
];

// 2. Automatically derive restricted entry rules for Lecture Building
const RESTRICTED_ENTRY_RULES = UNIVERSITY_EVENTS_RULES.filter((r) => {
    if (!r.note) return false;
    // Check for specific translation key OR literal "入構制限"
    return r.note === 'note.class_cancellation_restricted' || r.note.includes('入構制限');
}).map(r => ({
    ...r,
    isClosed: true, // Force close
    // Maintain original note
}));

export const CONST_SCHEDULE_DATA: Record<FacilityId, FacilityData> = {
    library: {
        name: '附属図書館',
        nameEn: 'TUFS Library',
        category: 'facility',
        unpublishedFrom: '2026-03-01',
        rules: [
            // Exceptions: Jan 2026
            Rules.closedRange('2026-01-01', '2026-01-04', 'note.new_year_holiday'),
            Rules.date('2026-01-16', times('09:00', '17:00')),
            Rules.closedRange('2026-01-17', '2026-01-18', 'note.common_test'),

            // Exceptions: Feb 2026
            Rules.date('2026-02-24', times('09:00', '17:00')),
            Rules.closedDate('2026-02-25', 'note.entrance_exam'),
            Rules.closedDate('2026-02-27', 'note.designated_closed'),

            // Dynamic Holidays (Closed on national holidays)
            Rules.nationalHoliday(true),

            // Default Logic
            Rules.weekday(HO.DEFAULT),
            Rules.subWeekday('saturday', times('13:00', '20:00')),
            Rules.subWeekday('sunday', [], true),
        ]
    },
    cafeteria_1f: {
        name: '1階食堂ミール',
        nameEn: 'Cafeteria Meal (1F)',
        category: 'facility',
        unpublishedFrom: '2026-04-01',
        rules: [
            Rules.closedRange('2026-01-01', '2026-01-04', '年始休業'),
            Rules.range('2026-01-05', '2026-01-06', HO.LUNCH_STD),
            Rules.date('2026-01-07', HO.LUNCH_SHORT, '短縮営業'),
            Rules.range('2026-01-08', '2026-01-09', HO.LUNCH_STD),
            Rules.closedRange('2026-01-10', '2026-01-12', 'note.includes_holiday'),
            Rules.date('2026-01-13', HO.LUNCH_STD),
            Rules.date('2026-01-14', HO.LUNCH_SHORT, 'note.short_hours'),
            Rules.date('2026-01-15', HO.LUNCH_STD),
            Rules.closedRange('2026-01-16', '2026-01-18'),
            Rules.range('2026-01-19', '2026-01-23', HO.LUNCH_EXAM),
            Rules.closedRange('2026-01-24', '2026-01-25'),
            Rules.range('2026-01-26', '2026-01-30', times('11:30', '13:00')),
            Rules.closedDate('2026-01-31'),

            // February 2026
            Rules.closedDate('2026-02-01', 'note.regular_holiday'),
            Rules.range('2026-02-02', '2026-02-06', times('11:30', '13:00')),
            Rules.closedDate('2026-02-07', 'note.regular_holiday'),
            Rules.closedDate('2026-02-08', 'note.regular_holiday'),
            Rules.range('2026-02-09', '2026-02-10', times('11:30', '13:00')),
            Rules.closedDate('2026-02-11', 'note.national_holiday'),
            Rules.range('2026-02-12', '2026-02-13', times('11:30', '13:00')),
            Rules.closedDate('2026-02-14', 'note.regular_holiday'),
            Rules.closedDate('2026-02-15', 'note.regular_holiday'),
            Rules.range('2026-02-16', '2026-02-20', times('11:30', '13:00')),
            Rules.closedDate('2026-02-21', '定休日'),
            Rules.closedDate('2026-02-22', '定休日'),
            Rules.closedDate('2026-02-23', '天皇誕生日（祝日）'),
            Rules.closedDate('2026-02-24'),
            Rules.closedDate('2026-02-25'),
            Rules.range('2026-02-26', '2026-02-27', times('11:30', '13:00')),
            Rules.closedDate('2026-02-28', '定休日'),

            // March 2026
            Rules.closedDate('2026-03-01', '定休日'),
            Rules.range('2026-03-02', '2026-03-06', [], '営業時間未定'),
            Rules.closedRange('2026-03-07', '2026-03-08', '定休日'),
            Rules.range('2026-03-09', '2026-03-10', [], '営業時間未定'),
            Rules.closedRange('2026-03-11', '2026-03-12', '後期日程試験（入構制限）'),
            Rules.date('2026-03-13', [], '営業時間未定'),
            Rules.closedRange('2026-03-14', '2026-03-15', '定休日'),
            Rules.date('2026-03-16', [], '営業時間未定'), // ミック? User provided '16日 1階食堂ミック' but likely typo for ミール or switch? Assuming Meal based on context. Wait, user provided "2026-03-16,1階食堂ミック,営業,不明" for Meal section. That's likely 'Meal'.
            Rules.range('2026-03-17', '2026-03-19', [], '営業時間未定'),
            Rules.date('2026-03-20', times('11:00', '13:30'), '卒業式'),
            Rules.closedRange('2026-03-21', '2026-03-22', '定休日'),
            Rules.range('2026-03-23', '2026-03-27', [], '営業時間未定'),
            Rules.closedRange('2026-03-28', '2026-03-29', '定休日'),
            Rules.range('2026-03-30', '2026-03-31', [], '営業時間未定'),

            // Fallbacks
            Rules.weekday(times('11:30', '14:30')),
            Rules.subWeekday('wednesday', times('11:30', '13:30')),
            Rules.subWeekday('saturday', [], true),
            Rules.subWeekday('sunday', [], true),
        ]
    },
    sabor_2f: {
        name: '2階食堂さぼおる',
        nameEn: 'Cafeteria Sabor (2F)',
        category: 'facility',
        unpublishedFrom: '2026-04-01',
        rules: [
            Rules.closedRange('2026-01-01', '2026-01-04', '年始休業'),
            Rules.range('2026-01-05', '2026-01-09', HO.LUNCH_STD, 'note.sabor_special'),
            Rules.closedRange('2026-01-10', '2026-01-12'),
            Rules.range('2026-01-13', '2026-01-15', HO.LUNCH_STD, 'note.sabor_special'),
            Rules.closedRange('2026-01-16', '2026-01-31', '1月末まで休業'),

            // February 2026
            Rules.closedRange('2026-02-01', '2026-02-28', '2月全日休業'),

            // March 2026
            Rules.closedRange('2026-03-01', '2026-03-31', '3月全日休業'),

            // Fallbacks
            Rules.weekday([], 'closed'), // Mark as closed basically
            Rules.subWeekday('saturday', [], true),
            Rules.subWeekday('sunday', [], true),
        ].map(r => r.type === 'weekday' ? { ...r, isClosed: true } : r)
    },
    store: {
        name: '購買書籍部ハッチポッチ',
        nameEn: 'Co-op Store Hatchpotch',
        category: 'facility',
        unpublishedFrom: '2026-04-01',
        rules: [
            Rules.closedRange('2026-01-01', '2026-01-04', '年始休業'),
            Rules.range('2026-01-05', '2026-01-06', HO.STORE_STD),
            Rules.date('2026-01-07', HO.STORE_SHORT, '短縮営業'),
            Rules.range('2026-01-08', '2026-01-09', HO.STORE_STD),
            Rules.closedRange('2026-01-10', '2026-01-12', '祝日含む'),
            Rules.date('2026-01-13', HO.STORE_STD),
            Rules.date('2026-01-14', HO.STORE_SHORT, '短縮営業'),
            Rules.date('2026-01-15', HO.STORE_STD),
            Rules.closedRange('2026-01-16', '2026-01-18'),
            Rules.range('2026-01-19', '2026-01-23', times('11:30', '14:30')),
            Rules.closedRange('2026-01-24', '2026-01-25'),
            Rules.range('2026-01-26', '2026-01-30', times('11:30', '13:00')),
            Rules.closedDate('2026-01-31'),

            // February 2026
            Rules.closedDate('2026-02-01', '定休日'),
            Rules.range('2026-02-02', '2026-02-06', times('11:30', '13:00'), '短縮営業'),
            Rules.closedDate('2026-02-07', '定休日'),
            Rules.closedDate('2026-02-08', '定休日'),
            Rules.range('2026-02-09', '2026-02-10', times('11:30', '13:00'), '短縮営業'),
            Rules.closedDate('2026-02-11', '建国記念の日（祝日）'),
            Rules.range('2026-02-12', '2026-02-13', times('11:30', '13:00'), '短縮営業'),
            Rules.closedDate('2026-02-14', '定休日'),
            Rules.closedDate('2026-02-15', '定休日'),
            Rules.range('2026-02-16', '2026-02-20', times('11:30', '13:00'), '短縮営業'),
            Rules.closedDate('2026-02-21', '定休日'),
            Rules.closedDate('2026-02-22', '定休日'),
            Rules.closedDate('2026-02-23', '天皇誕生日（祝日）'),
            Rules.closedDate('2026-02-24'),
            Rules.closedDate('2026-02-25'),
            Rules.range('2026-02-26', '2026-02-27', times('11:30', '13:00'), '短縮営業'),
            Rules.closedDate('2026-02-28', '定休日'),

            // March 2026
            Rules.closedDate('2026-03-01', '定休日'),
            Rules.range('2026-03-02', '2026-03-06', [], '営業時間未定'),
            Rules.closedRange('2026-03-07', '2026-03-08', '定休日'),
            Rules.range('2026-03-09', '2026-03-11', [], '営業時間未定'),
            Rules.closedDate('2026-03-12', '後期日程試験（入構制限）'), // Matches offline? 12th is closed for store in user list. 11th Open? User: 11 Open, 12 Closed.
            Rules.date('2026-03-13', [], '営業時間未定'),
            Rules.closedRange('2026-03-14', '2026-03-15', '定休日'),
            Rules.range('2026-03-16', '2026-03-19', [], '営業時間未定'),
            Rules.date('2026-03-20', times('11:00', '16:30'), '卒業式'),
            Rules.closedRange('2026-03-21', '2026-03-22', '定休日'),
            Rules.range('2026-03-23', '2026-03-27', [], '営業時間未定'),
            Rules.closedRange('2026-03-28', '2026-03-29', '定休日'),
            Rules.range('2026-03-30', '2026-03-31', [], '営業時間未定'),

            // Fallbacks
            Rules.weekday(HO.STORE_STD),
            Rules.subWeekday('wednesday', HO.STORE_SHORT),
            Rules.subWeekday('saturday', [], true),
            Rules.subWeekday('sunday', [], true),
        ]
    },
    academic_affairs: {
        name: '教務・学生・留学生課',
        nameEn: 'Academic, Student & International Student Affairs',
        category: 'admin',
        unpublishedFrom: '2026-04-01',
        rules: [
            ...COMMON_ADMIN_RULES,
            Rules.weekday(HO.ADMIN_LUNCH, '昼休み 12:40-13:40'),
        ]
    },
    admission: {
        name: '入試課',
        nameEn: 'Admissions',
        category: 'admin',
        unpublishedFrom: '2026-04-01',
        rules: [
            ...COMMON_ADMIN_RULES,
            Rules.weekday(HO.ADMISSION_LUNCH, '昼休み 12:00-13:00'),
        ]
    },
    accounting: {
        name: '会計課',
        nameEn: 'Accounting Division',
        category: 'admin',
        unpublishedFrom: '2026-04-01',
        rules: [
            ...COMMON_ADMIN_RULES,
            Rules.weekday(HO.ADMIN_STD, '現金受付は15:00まで'),
        ]
    },
    cert_machine: {
        name: '証明書発行機',
        nameEn: 'Certificate Machine',
        category: 'facility',
        unpublishedFrom: '2026-04-01',
        rules: [
            ...COMMON_ADMIN_RULES,
            Rules.weekday(times('09:00', '17:00')),
        ]
    },
    circle_bldg: {
        name: 'サークル棟',
        nameEn: 'Circle Building',
        category: 'facility',
        unpublishedFrom: '2026-04-01',
        rules: [
            ...RESTRICTED_ENTRY_RULES,
            Rules.weekday(HO.EARLY_LATE),
            Rules.subWeekday('saturday', HO.EARLY_LATE),
            Rules.subWeekday('sunday', HO.EARLY_LATE),
        ]
    },
    lecture_bldg: {
        name: '研究講義棟',
        nameEn: 'Research & Lecture Bldg',
        category: 'facility',
        unpublishedFrom: '2026-04-01',
        rules: [
            ...RESTRICTED_ENTRY_RULES, // <--- Injection Point
            Rules.closedRange('2026-01-01', '2026-01-04', '年始休業'),
            Rules.date('2026-01-05', HO.EARLY_LATE),
            Rules.date('2026-01-08', HO.EARLY_LATE),
            Rules.date('2026-01-09', HO.EARLY_LATE),
            Rules.date('2026-01-13', HO.EARLY_LATE),
            Rules.date('2026-01-15', HO.EARLY_LATE),
            Rules.closedDate('2026-01-16'),
            // Rules.closedRange('2026-01-17', '2026-01-18'), // Duplicate is OK, first match wins or injection ensures it. Actually, closedRange above will take priority if placed first. 
            // Wait, priority in status-utils is "Specific Date" > "National Holiday" > "Range".
            // RESTRICTED_ENTRY_RULES contains specific date/range rules.
            // If we spread RESTRICTED_ENTRY_RULES first, they will be present in the array.
            // But status-utils.ts finds the FIRST match for "specific_date".
            // So if RESTRICTED_ENTRY_RULES has 1/16 and this list also has 1/16, the one that appears first in the `find` logic matter?
            // Actually `find` returns the first element that satisfies the condition.
            // So order in the array MATTERS.
            // By putting `...RESTRICTED_ENTRY_RULES` first, checking logic will find them first?
            // Wait, `find(r => r.type === 'specific_date' ...)` searches the array. 
            // Yes, `find` returns the first match in iteration order.
            // So putting RESTRICTED_ENTRY_RULES at the top gives them priority.

            Rules.range('2026-01-19', '2026-01-23', HO.EARLY_LATE),
            Rules.date('2026-01-26', HO.EARLY_LATE),
            // Fallbacks
            Rules.weekday(HO.EARLY_LATE),
            Rules.subWeekday('saturday', [], true),
            Rules.subWeekday('sunday', [], true),
        ]
    },
    agora_global: {
        name: 'アゴラ・グローバル',
        nameEn: 'Agora Global',
        category: 'facility',
        unpublishedFrom: '2026-04-01',
        rules: [
            ...RESTRICTED_ENTRY_RULES,
            Rules.weekday(HO.EARLY_LATE),
            Rules.subWeekday('saturday', [], true),
            Rules.subWeekday('sunday', [], true),
        ]
    },
    cafe_castalia: {
        name: 'カフェ・カスタリア',
        nameEn: 'Cafe Castalia',
        category: 'facility',
        unpublishedFrom: '2026-04-01',
        rules: [
            Rules.weekday(times('11:00', '17:00')),
            Rules.subWeekday('saturday', [], true),
            Rules.subWeekday('sunday', [], true),
        ]
    },
    admin_bldg: {
        name: '本部管理棟',
        nameEn: 'Administration Building',
        category: 'admin',
        unpublishedFrom: '2026-04-01',
        rules: [
            // Exceptions: New Year
            Rules.closedRange('2026-01-01', '2026-01-04', '年始休業'),

            // Holidays (2026 Jan-Mar)
            Rules.closedDate('2026-01-12', '成人の日'),
            Rules.closedDate('2026-02-11', '建国記念の日'),
            Rules.closedDate('2026-02-23', '天皇誕生日'),
            Rules.closedDate('2026-03-20', '春分の日'),

            // Default Logic
            Rules.weekday(HO.ADMIN_STD),
            Rules.subWeekday('saturday', [], true), // Closed
            Rules.subWeekday('sunday', [], true),   // Closed
        ]
    },
    university_events: {
        name: '大学行事予定',
        nameEn: 'University Events',
        category: 'facility',
        unpublishedFrom: '2026-04-01',
        rules: UNIVERSITY_EVENTS_RULES
    }
};

// Derived exports for backward compatibility
export const FACILITIES = Object.entries(CONST_SCHEDULE_DATA).map(([id, data]) => ({
    id: id as FacilityId,
    name: data.name,
    nameEn: data.nameEn,
    category: data.category
}));

export const SCHEDULES: Record<FacilityId, ScheduleRule[]> = Object.fromEntries(
    Object.entries(CONST_SCHEDULE_DATA).map(([id, data]) => [id, data.rules])
) as Record<FacilityId, ScheduleRule[]>;

export const DATA_LAST_UPDATED = '2026-01-10'; // YYYY-MM-DD
