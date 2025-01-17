import {create, StoreApi, UseBoundStore} from "zustand";
import {combine} from "zustand/middleware";
import {fetchFunc} from "../../hooks/useFetch.ts";
import {getDepartmentBasics} from "../../data/repository/departmentRepository.ts";
import {Department} from "../../entity";

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
    primaryDepartment: 'DPP',
    modalBreakpoints: {
        xs: '90%',
        sm: '80%',
        md: '70%',
        lg: '70%',
        xl: '50%',
        xxl: '50%',
    },
    departments: [] as Department[],
}, (set) => ({
    updateAcademicYear (academicYear: string) {
        set({academicYear: academicYear});
    },
    setDepartment () {
        fetchFunc(getDepartmentBasics)
            .then(resp => {
                if(resp.isSuccess) {
                    set({departments: resp.data as Department[]})
                }
            })
    }
}))))

export const initDepartments = (): Department[] => {
    const store = useGlobalStore.getState()
    store.setDepartment();
    return store.departments
}