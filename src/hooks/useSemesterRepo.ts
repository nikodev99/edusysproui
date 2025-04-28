import {useEffect, useState} from "react";
import {Semester} from "../entity";
import {useRawFetch} from "./useFetch.ts";
import {getAllSemesters} from "../data/repository/semesterRepository.ts";

export const useSemesterRepo = () => {
    const useGetAllSemesters = () => {
        const [semester, setSemester] = useState<Semester[]>([])
        const fetch = useRawFetch()
        
        useEffect(() => {
            fetch(getAllSemesters, [])
                .then(resp => {
                    if (resp) {
                        setSemester(resp.data as Semester[])
                    }
                })
        }, [fetch])

        return semester
    }

    return {
        useGetAllSemesters
    }
}