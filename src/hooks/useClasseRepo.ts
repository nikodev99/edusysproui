import {Pageable} from "../core/utils/interfaces.ts";
import {useFetch, useRawFetch} from "./useFetch.ts";
import {
    getAllClasses,
    getAllSearchClasses,
    getClasse,
    getClassesBasicValues
} from "../data/repository/classeRepository.ts";
import {useEffect, useState} from "react";
import {Classe} from "../entity";

export const useClasseRepo = () => {
    const useGetAllClasse = (page: Pageable, sortCriteria?: string) => useFetch(
        ['classes'],
        getAllClasses,
        [page, sortCriteria],
        !!page.size
    )
    
    const useGetAllSearchClasses = (classeName: string) => {
        const [classes, setClasses] = useState<Classe[]>([])
        const fetch = useRawFetch()

        useEffect(() => {
            if (classeName)
                fetch(getAllSearchClasses, [classeName])
                    .then(resp => {
                        if (resp.isSuccess) {
                            setClasses(resp.data as Classe[])
                        }
                    }
                )
        }, [classeName, fetch]);

        return classes
    }

    const useGetClasse = (classeId: number, academicYear: string) => useFetch(
        ['classe', classeId],
        getClasse,
        [classeId, academicYear],
        !!classeId && !!academicYear
    )

    const useGetClasseBasicValues = () => {
        const [classes, setClasses] = useState<Classe[]>([])
        const fetch = useRawFetch()

        useEffect(() => {
            fetch(getClassesBasicValues, [])
                .then(resp => {
                        if (resp.isSuccess) {
                            setClasses(resp.data as Classe[])
                        }
                    }
                )
        }, [fetch]);

        return classes
    }

    return {
        useGetAllClasse,
        useGetAllSearchClasses,
        useGetClasse,
        useGetClasseBasicValues
    }
}