import {apiClient} from "@/data/axiosConfig.ts";
import {JsonValue, Setting} from "@/entity";

export const SettingRepo = {
    saveOrUpdate: <T extends JsonValue>(setting: Setting) => apiClient.post<Setting<T>>(`/settings`, setting),
    schoolSettings: <T extends JsonValue>(schoolId: string) => apiClient.get<Setting<T>[]>(`/settings/${schoolId}`),
    getSetting: <T extends JsonValue>(schoolId: string, settingTitle: string) => apiClient.get<Setting<T>>(`/settings/${schoolId}/${settingTitle}`)
};