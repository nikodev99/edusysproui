import {create, StoreApi, UseBoundStore} from "zustand";
import {combine} from "zustand/middleware";
import {fetchFunc} from "../../hooks/useFetch.ts";
import {getDepartmentBasics} from "../../data/repository/departmentRepository.ts";
import {AcademicYear, Department} from "../../entity";
import {getAcademicYearFromYear, getCurrentAcademicYear} from "../../data/repository/academicYearRepository.ts";

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
    currentAcademicYear: {} as AcademicYear,
    academicYears: [] as AcademicYear[],
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
    },

    setCurrentAcademicYear () {
        fetchFunc(getCurrentAcademicYear)
            .then(resp => {
                if(resp.isSuccess) {
                    set({currentAcademicYear: resp.data as AcademicYear});
                }
            })
    },

    setAcademicYears (year: number): void {
        fetchFunc(getAcademicYearFromYear, [year])
            .then(resp => {
                if (resp.isSuccess)
                    set({academicYears: resp.data as AcademicYear[]})
            })
    }
}))))

export const initDepartments = (): Department[] => {
    const store = useGlobalStore.getState()
    store.setDepartment();
    return store.departments
}

export const initCurrentAcademicYear = () => {
    const store = useGlobalStore.getState()
    store.setCurrentAcademicYear()
    return store.currentAcademicYear
}

export const initAcademicYears = (year: number) => {
    const store = useGlobalStore.getState()
    store.setAcademicYears(year)
    return store.academicYears
}