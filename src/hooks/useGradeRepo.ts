import {useEffect, useState} from "react";
import {Grade} from "../entity";
import {useRawFetch} from "./useFetch.ts";
import {getAllSchoolGrades} from "../data/repository/gradeRepository.ts";

export const useGradeRepo = () => {
    const useGetAllGrades = () => {
        const [grades, setGrades] = useState<Grade[]>([])
        const fetch = useRawFetch()

        useEffect(() => {
            fetch(getAllSchoolGrades, [])
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