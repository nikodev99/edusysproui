import {useGlobalStore} from "../core/global/store.ts";
import {useEffect} from "react";

export const useClasseAttendance = (classeId: number, academicYear: string) => {
    const classeAttendances = useGlobalStore(state => state.classeAttendance)
    const setClasseAttendances = useGlobalStore(state => state.setClasseAttendance)

    useEffect(() => {
        setClasseAttendances(classeId, academicYear as string)
    }, [academicYear, classeId, setClasseAttendances]);

    return {classeAttendances, setClasseAttendances}
}