import {create, StoreApi, UseBoundStore} from "zustand";
import {combine} from "zustand/middleware";

type WithSelectors<S> = S extends { getState: () => infer T }
    ? S & { use: { [K in keyof T]: () => T[K] } }
    : never

/* eslint-disable @typescript-eslint/no-explicit-any */
const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(
    _store: S,
) => {
    const store = _store as WithSelectors<typeof _store>
    store.use = {}
    for (const k of Object.keys(store.getState())) {
        (store.use as any)[k] = () => store((s) => s[k as keyof typeof s])
    }
    return store
}

export const useGlobalStore = createSelectors(create(combine({
    academicYear: '2024-2025',
}, (set) => ({
    updateAcademicYear (academicYear: string) {
        set({academicYear: academicYear});
    }
}))))