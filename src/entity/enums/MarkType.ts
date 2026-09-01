export enum MarkType {
    EX = 'Excellent',
    TB = 'Trè Bien',
    GOOD = 'Bien',
    AB = 'Assez Bien',
    PA = 'Passable',
    IN = 'Insuffisant',
    FA = 'Faible',
    TF = 'Très Faible'
}

export type MarkLabel = keyof typeof MarkType

// Types for your data structures
export interface MarkLabels {
    key: number;
    avg: number | null; // InputNumber can be null if empty
    label: MarkLabel | string;
}

export interface GradeConfig {
    maxValue: number;
    markLabels: MarkLabels[];
}