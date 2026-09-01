import {Messages} from "@/components/ui/layout/ConfirmationModal.tsx";

export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export enum SettingTitle {
    STUDENT_NAMES = "STUDENT_NAMES",
    EXAM_NAMES = "EXAM_NAMES",
    GRADING_MODE = 'GRADING_MODE',
    GRADING_APPRECIATION_LABELS = 'GRADING_APPRECIATION_LABELS',

    ATTENDANCE_MODE = 'ATTENDANCE_MODE',
}

export interface Setting<T extends JsonValue = JsonValue> {
    id: number,
    tenantId: string,
    title: SettingTitle,
    value: T
}

export type CamelCase<S extends string> = S extends  `${infer Head}_${infer Tail}` ? `${Lowercase<Head>}${CamelCase<Tail>}` : Lowercase<S>;

export type SettingsAccessor<T extends JsonValue = JsonValue> = {
    [K in SettingTitle as CamelCase<K>]: T | undefined
}

export type SettingProps<T extends JsonValue = JsonValue> = {settings: SettingsAccessor<T>, getMessages?: (messages: Messages) => void}

export function toCamelCase(key: string): string {
    return key.toLowerCase()
        .replace(/_([a-z0-9])/g, (_, c) => c.toLowerCase());
}

export function getSetting<T>(value: JsonValue | undefined, fallback: T): T {
    return (value ?? fallback) as unknown as T;
}