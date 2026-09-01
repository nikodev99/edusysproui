import {JsonValue, SettingsAccessor, SettingTitle, toCamelCase} from "@/entity";
import {SettingsMap, useSettingStore} from "@/core/global/settingStore.ts";
import {useMemo} from "react";

function buildAccessor<T extends JsonValue = JsonValue>(map: SettingsMap<T>): SettingsAccessor<T> {
    const out = {};
    for (const title of Object.values(SettingTitle)) {
        out[toCamelCase(title)] = map[title];
    }
    return out as SettingsAccessor<T>;
}

export const useSetting = <T extends JsonValue = JsonValue>(): SettingsAccessor<T> => {
    const map = useSettingStore<SettingsMap<T>>(s => s.map as SettingsMap<T>)
    return useMemo(() => buildAccessor(map), [map])
}

export const settings: SettingsAccessor = new Proxy({} as SettingsAccessor, {
    get: (_, prop: string) => buildAccessor(useSettingStore.getState().map)[prop as keyof SettingTitle],
}) as SettingsAccessor
