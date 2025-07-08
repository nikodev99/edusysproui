import {useEffect, useState} from "react";
import {Grade} from "../entity";
import {useRawFetch} from "./useFetch.ts";
import {getAllSchoolGrades} from "../data/repository/gradeRepository.ts";
import {loggedUser} from "../auth/jwt/LoggedUser.ts";

export const useGradeRepo = () => {
    const userSchool = loggedUser.getSchool()

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
       useGetAllGrades
    }
}