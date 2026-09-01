import {JsonValue, Setting, SettingTitle} from "@/entity";
import {create, StoreApi, UseBoundStore} from "zustand";
import {persist} from "zustand/middleware";
import {SettingRepo} from "@/data/repository/settingRepository.ts";
import {fetchFunc} from "@/hooks/useFetch.ts";
import {loggedUser} from "@/auth/jwt/LoggedUser.ts";

export type SettingsMap<T extends JsonValue = JsonValue> = Partial<Record<SettingTitle, T>>
export type SettingRecord<T extends JsonValue = JsonValue> = Partial<Record<SettingTitle, Setting<T>>>

type WithSelectors<S> = S extends { getState: () => infer T }
    ? S & { use: { [K in keyof T]: () => T[K] } }
    : never;

export function createSelectors<S extends UseBoundStore<StoreApi<object>>>(store: S) {
    const withSelectors = store as WithSelectors<S>;
    withSelectors.use = {};
    for (const k of Object.keys(store.getState())) {
        (withSelectors.use)[k] = () => store((s) => s[k as keyof typeof s]);
    }
    return withSelectors;
}

export interface SettingState<T extends JsonValue = JsonValue> {
    map: SettingsMap<T>;
    records: SettingRecord<T>
    tenantId: string | null;
    loading: boolean;
    error: string | null;
    fetchSettings: () => Promise<void>;
    updateSetting: (title: SettingTitle, value: JsonValue) => Promise<Setting>;
    clear: () => void;
}

export const useSettingStore = create<SettingState>()(persist((set, get) => ({
    map: {},
    records: {},
    tenantId: loggedUser.getSchool()?.id ?? null,
    loading: false,
    error: null,

    fetchSettings: async () => {
        set({ loading: true, error: null });
        try {
            const schoolId = get().tenantId ?? loggedUser.getSchool()?.id as string;
            const res = await fetchFunc(SettingRepo.schoolSettings, [schoolId]);

            const records = (res.data as Setting[] ?? []).reduce<SettingRecord>((acc, s) => {
                acc[s.title] = s;
                return acc;
            }, {});

            const map = (res.data as Setting[] ?? []).reduce<SettingsMap>((acc, s) => {
                acc[s.title] = s.value;
                return acc;
            }, {});

            set({ map, records, tenantId: schoolId, loading: false });
        } catch (e) {
            set({ error: e instanceof Error ? e.message : 'Failed to load settings', loading: false });
        }
    },

    updateSetting: async (title: SettingTitle, value: JsonValue) => {
        const { records, tenantId, map } = get();
        const existing = records[title];
        const payload = {
            id: existing?.id,        // undefined -> create, present -> update
            tenantId: existing?.tenantId ?? tenantId ?? loggedUser.getSchool()?.id,
            title,
            value,
        } as Setting;

        set((s) => ({
            records: { ...s.records, [title]: payload },
            map: { ...s.map, [title]: value },
        }));

        try {
           await SettingRepo.saveOrUpdate(payload);
        }catch (e) {
            set({ records, map, error: e instanceof Error ? e.message : 'Failed to save setting', loading: false });
        }
        return payload;
    },

    clear: () => set({map: {}, records: {}, tenantId: null, loading: false, error: null}),
}), {
    name: '@edusyspro-settings-storage',
    partialize: (state) => ({ map: state.map, tenantId: state.tenantId }),
}))

export const createSettings = createSelectors(useSettingStore)