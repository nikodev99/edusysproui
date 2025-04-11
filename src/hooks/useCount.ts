import {useGlobalStore} from "../core/global/store.ts";
import {useEffect} from "react";
import {GenderCounted} from "../core/utils/interfaces.ts";

interface Counted {
    all?: boolean
    student?: boolean
    teacher?: boolean
}

export const useCount = ({all, student, teacher}: Counted) => {
    const countAllStudent: number = useGlobalStore(state => state.countAllStudent)
    const setCountStudent = useGlobalStore(state => state.setCountAllStudent)
    const countAllTeachers: GenderCounted[] = useGlobalStore(state => state.allTeachers)
    const setCountTeachers = useGlobalStore(state => state.setCountAllTeacher)

    useEffect(() => {
        if (all || student) {
            setCountStudent();
        }
        if (all || teacher) {
            setCountTeachers();
        }
    }, [all, setCountStudent, setCountTeachers, student, teacher])

    return {
        countAllStudent,
        countAllTeachers
    }
}