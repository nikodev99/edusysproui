import {useGlobalStore} from "../core/global/store.ts";
import {useEffect} from "react";

export const useSchoolAttendance = (schoolId: string, academicYear: string) => {
    const schoolAttendances = useGlobalStore(state => state.schoolAttendance)
    const setSchoolAttendances = useGlobalStore(state => state.setSchoolAttendance)

    useEffect(() => {
        if (schoolAttendances?.length === 0)
            setSchoolAttendances(schoolId, academicYear as string)
    }, [academicYear, schoolAttendances?.length, schoolId, setSchoolAttendances]);

    return {schoolAttendances, setSchoolAttendances}
}