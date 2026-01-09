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
    | 'cafe_castalia';

export type ScheduleRule = {
    type: 'weekday' | 'wednesday' | 'saturday' | 'sunday' | 'specific_date' | 'range';
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

    // Shortcuts for Closed/Open
    closedDate: (date: string, note?: string): ScheduleRule => ({
        type: 'specific_date', dates: [date], hours: [], isClosed: true, note
    }),
    closedRange: (startDate: string, endDate: string, note?: string): ScheduleRule => ({
        type: 'range', startDate, endDate, hours: [], isClosed: true, note
    }),
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

export const CONST_SCHEDULE_DATA: Record<FacilityId, FacilityData> = {
    library: {
        name: '附属図書館',
        nameEn: 'TUFS Library',
        category: 'facility',
        rules: [
            Rules.closedRange('2026-01-01', '2026-01-04', '年始休館'),
            Rules.date('2026-01-05', HO.DEFAULT, '授業再開'),
            Rules.range('2026-01-06', '2026-01-09', HO.DEFAULT),
            Rules.date('2026-01-10', times('13:00', '20:00')),
            Rules.closedRange('2026-01-11', '2026-01-12', '日曜・祝日休館'),
            Rules.date('2026-01-13', HO.DEFAULT),
            Rules.range('2026-01-14', '2026-01-15', HO.DEFAULT),
            Rules.date('2026-01-16', times('09:00', '17:00')),
            Rules.closedRange('2026-01-17', '2026-01-18', '大学入学共通テスト（入構制限）'),
            Rules.range('2026-01-19', '2026-01-23', HO.DEFAULT),
            Rules.date('2026-01-24', times('13:00', '20:00')),
            Rules.closedDate('2026-01-25', '日曜休館'),
            Rules.date('2026-01-26', HO.DEFAULT, '冬学期開始'),
            Rules.range('2026-01-27', '2026-01-30', HO.DEFAULT),
            Rules.date('2026-01-31', times('13:00', '20:00')),

            // February 2026
            Rules.closedDate('2026-02-01', '日曜休館'),
            Rules.range('2026-02-02', '2026-02-06', HO.DEFAULT),
            Rules.date('2026-02-07', times('13:00', '20:00')),
            Rules.closedDate('2026-02-08', '日曜休館'),
            Rules.range('2026-02-09', '2026-02-10', HO.DEFAULT),
            Rules.closedDate('2026-02-11', '建国記念の日'),
            Rules.range('2026-02-12', '2026-02-13', HO.DEFAULT),
            Rules.date('2026-02-14', times('13:00', '20:00')),
            Rules.closedDate('2026-02-15', '日曜休館'),
            Rules.range('2026-02-16', '2026-02-20', HO.DEFAULT),
            Rules.date('2026-02-21', times('13:00', '20:00')),
            Rules.closedDate('2026-02-22', '日曜休館'),
            Rules.closedDate('2026-02-23', '天皇誕生日'),
            Rules.date('2026-02-24', times('09:00', '17:00')),
            Rules.closedDate('2026-02-25', '二次試験日'),
            Rules.date('2026-02-26', HO.DEFAULT),
            Rules.closedDate('2026-02-27', '指定休館日'),
            Rules.date('2026-02-28', times('13:00', '20:00')),
            // Fallbacks
            Rules.weekday(HO.DEFAULT),
            Rules.subWeekday('saturday', times('13:00', '20:00')),
            Rules.subWeekday('sunday', [], true),
        ]
    },
    cafeteria_1f: {
        name: '1階食堂ミール',
        nameEn: 'Cafeteria Meal (1F)',
        category: 'facility',
        rules: [
            Rules.closedRange('2026-01-01', '2026-01-04', '年始休業'),
            Rules.range('2026-01-05', '2026-01-06', HO.LUNCH_STD),
            Rules.date('2026-01-07', HO.LUNCH_SHORT, '短縮営業'),
            Rules.range('2026-01-08', '2026-01-09', HO.LUNCH_STD),
            Rules.closedRange('2026-01-10', '2026-01-12', '祝日含む'),
            Rules.date('2026-01-13', HO.LUNCH_STD),
            Rules.date('2026-01-14', HO.LUNCH_SHORT, '短縮営業'),
            Rules.date('2026-01-15', HO.LUNCH_STD),
            Rules.closedRange('2026-01-16', '2026-01-18', '共通テスト・入試準備'),
            Rules.range('2026-01-19', '2026-01-23', HO.LUNCH_EXAM, '定期試験期間'),
            Rules.closedRange('2026-01-24', '2026-01-25'),
            Rules.range('2026-01-26', '2026-01-30', times('11:30', '13:00'), '冬学期・短縮営業'),
            Rules.closedDate('2026-01-31'),

            // February 2026
            Rules.closedDate('2026-02-01', '定休日'),
            Rules.range('2026-02-02', '2026-02-06', times('11:30', '13:00')),
            Rules.closedDate('2026-02-07', '定休日'),
            Rules.closedDate('2026-02-08', '定休日'),
            Rules.range('2026-02-09', '2026-02-10', times('11:30', '13:00')),
            Rules.closedDate('2026-02-11', '建国記念の日（祝日）'),
            Rules.range('2026-02-12', '2026-02-13', times('11:30', '13:00')),
            Rules.closedDate('2026-02-14', '定休日'),
            Rules.closedDate('2026-02-15', '定休日'),
            Rules.range('2026-02-16', '2026-02-20', times('11:30', '13:00')),
            Rules.closedDate('2026-02-21', '定休日'),
            Rules.closedDate('2026-02-22', '定休日'),
            Rules.closedDate('2026-02-23', '天皇誕生日（祝日）'),
            Rules.closedDate('2026-02-24', '入試準備'),
            Rules.closedDate('2026-02-25', '東外大 前期日程'),
            Rules.range('2026-02-26', '2026-02-27', times('11:30', '13:00')),
            Rules.closedDate('2026-02-28', '定休日'),
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
        rules: [
            Rules.closedRange('2026-01-01', '2026-01-04', '年始休業'),
            Rules.range('2026-01-05', '2026-01-09', HO.LUNCH_STD, '11:00-13:00（食事メニュー提供）、11:00-14:30（焼き立てパン販売）'),
            Rules.closedRange('2026-01-10', '2026-01-12'),
            Rules.range('2026-01-13', '2026-01-15', HO.LUNCH_STD, '11:00-13:00（食事メニュー提供）、11:00-14:30（焼き立てパン販売）'),
            Rules.closedRange('2026-01-16', '2026-01-31', '1月末まで休業'),

            // February 2026
            Rules.closedRange('2026-02-01', '2026-02-28', '2月全日休業'),
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
        rules: [
            Rules.closedRange('2026-01-01', '2026-01-04', '年始休業'),
            Rules.range('2026-01-05', '2026-01-06', HO.STORE_STD),
            Rules.date('2026-01-07', HO.STORE_SHORT, '短縮営業'),
            Rules.range('2026-01-08', '2026-01-09', HO.STORE_STD),
            Rules.closedRange('2026-01-10', '2026-01-12', '祝日含む'),
            Rules.date('2026-01-13', HO.STORE_STD),
            Rules.date('2026-01-14', HO.STORE_SHORT, '短縮営業'),
            Rules.date('2026-01-15', HO.STORE_STD),
            Rules.closedRange('2026-01-16', '2026-01-18', '共通テスト・入試準備'),
            Rules.range('2026-01-19', '2026-01-23', times('11:30', '14:30'), '定期試験期間'),
            Rules.closedRange('2026-01-24', '2026-01-25'),
            Rules.range('2026-01-26', '2026-01-30', times('11:30', '13:00'), '冬学期・短縮営業'),
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
            Rules.closedDate('2026-02-24', '入試準備'),
            Rules.closedDate('2026-02-25', '東外大 前期日程'),
            Rules.range('2026-02-26', '2026-02-27', times('11:30', '13:00'), '短縮営業'),
            Rules.closedDate('2026-02-28', '定休日'),
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
        rules: [
            Rules.weekday(HO.ADMIN_LUNCH, '昼休み 12:40-13:40'),
            Rules.subWeekday('saturday', [], true),
            Rules.subWeekday('sunday', [], true),
        ]
    },
    admission: {
        name: '入試課',
        nameEn: 'Admissions',
        category: 'admin',
        rules: [
            Rules.weekday(HO.ADMISSION_LUNCH, '昼休み 12:00-13:00'),
            Rules.subWeekday('saturday', [], true),
            Rules.subWeekday('sunday', [], true),
        ]
    },
    accounting: {
        name: '会計課',
        nameEn: 'Accounting Division',
        category: 'admin',
        rules: [
            Rules.weekday(HO.ADMIN_STD, '現金受付は15:00まで'),
            Rules.subWeekday('saturday', [], true),
            Rules.subWeekday('sunday', [], true),
        ]
    },
    cert_machine: {
        name: '証明書発行機',
        nameEn: 'Certificate Machine',
        category: 'facility',
        rules: [
            Rules.weekday(times('09:00', '17:00')),
            Rules.subWeekday('saturday', [], true),
            Rules.subWeekday('sunday', [], true),
        ]
    },
    circle_bldg: {
        name: 'サークル棟',
        nameEn: 'Circle Building',
        category: 'facility',
        rules: [
            Rules.weekday(HO.EARLY_LATE),
            Rules.subWeekday('saturday', HO.EARLY_LATE),
            Rules.subWeekday('sunday', HO.EARLY_LATE),
        ]
    },
    lecture_bldg: {
        name: '研究講義棟',
        nameEn: 'Research & Lecture Bldg',
        category: 'facility',
        rules: [
            Rules.closedRange('2026-01-01', '2026-01-04', '年始休業'),
            Rules.date('2026-01-05', HO.EARLY_LATE, '授業再開'),
            Rules.date('2026-01-08', HO.EARLY_LATE, '履修登録･修正期間(冬学期)'),
            Rules.date('2026-01-09', HO.EARLY_LATE, '履修登録･修正期間(冬学期) / 卒業論文・卒業研究 提出締切'),
            Rules.date('2026-01-13', HO.EARLY_LATE, '金曜授業実施日'),
            Rules.date('2026-01-15', HO.EARLY_LATE, '秋学期授業終了'),
            Rules.closedDate('2026-01-16', '全学臨時休講'),
            Rules.closedRange('2026-01-17', '2026-01-18', '全学臨時休講 (共通テスト)'),
            Rules.range('2026-01-19', '2026-01-23', HO.EARLY_LATE, '秋学期 定期試験期間'),
            Rules.date('2026-01-26', HO.EARLY_LATE, '冬学期 授業開始'),
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
        rules: [
            Rules.weekday(HO.EARLY_LATE),
            Rules.subWeekday('saturday', [], true),
            Rules.subWeekday('sunday', [], true),
        ]
    },
    cafe_castalia: {
        name: 'カフェ・カスタリア',
        nameEn: 'Cafe Castalia',
        category: 'facility',
        rules: [
            Rules.weekday(times('11:00', '17:00')),
            Rules.subWeekday('saturday', [], true),
            Rules.subWeekday('sunday', [], true),
        ]
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
