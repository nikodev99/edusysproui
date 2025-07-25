import {useEffect, useState} from "react";
import {Grade} from "../entity";
import {useRawFetch} from "./useFetch.ts";
import {getAllSchoolGrades, saveGrade} from "../data/repository/gradeRepository.ts";
import {loggedUser} from "../auth/jwt/LoggedUser.ts";
import {useInsert} from "./usePost.ts";
import {gradeSchema} from "../schema";

export const useGradeRepo = () => {
    const userSchool = loggedUser.getSchool()

    const useInsertGrade = () =>
        useInsert(gradeSchema, saveGrade)

    const useGetAllGrades = () => {
        const [grades, setGrades] = useState<Grade[]>([])
        const fetch = useRawFetch()

        useEffect(() => {
            fetch(getAllSchoolGrades, [userSchool?.id])
                .then(resp => {
                    if (resp) {
                        setGrades(resp.data as Grade[])
                    }
                })
        }, [fetch]);
        
        return grades
    }

    return {
        useInsertGrade,
       useGetAllGrades
    }
}