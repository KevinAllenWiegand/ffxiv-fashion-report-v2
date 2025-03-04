export interface HintItem {
    name: string;
}

export interface Slot {
    type: string,
    hint: string,
    items: HintItem[]
}

export interface ReportSlot {
    type: string,
    hint: string,
}

export interface Report {
    week: number,
    date: string,
    theme: string,
    slots: ReportSlot[]
}

export interface MasterData {
    slots: Slot[],
    reports: Report[]
}

export const SlotTypes = [
    'All',
    'Head',
    'Body',
    'Hands',
    'Legs',
    'Feet',
    'Ear',
    'Neck',
    'Wrist',
    'Ring'
];