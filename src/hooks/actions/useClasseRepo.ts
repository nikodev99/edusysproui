import {Pageable} from "../../core/utils/interfaces.ts";
import {useFetch, useRawFetch} from "../useFetch.ts";
import {
    getAllClasses,
    getAllSearchClasses,
    getClasse,
    getClassesBasicValues
} from "../../data/repository/classeRepository.ts";
import {useEffect, useState} from "react";
import {Classe} from "../../entity";
import {getShortSortOrder, setSortFieldName} from "../../core/utils/utils.ts";
import {useGlobalStore} from "../../core/global/store.ts";

export const useClasseRepo = () => {
    const schoolId = useGlobalStore(state => state.schoolId)

    const useGetAllClasse = (page: Pageable, sortCriteria?: string) => useFetch(
        ['classes'],
        getAllClasses,
        [schoolId, page, sortCriteria],
        !!schoolId && !!page.size
    )

    const getPaginatedClasses = async (page: number, size: number, sortField?: string, sortOrder?: string) => {
        if(sortField && sortOrder) {
            sortOrder = getShortSortOrder(sortOrder)
            sortField = sortedField(sortField);
            return await getAllClasses(schoolId as string, {page: page, size: size}, `${sortField}:${sortOrder}`);
        }
        return await getAllClasses(schoolId as string, {page: page, size: size})
    }
    
    const useGetAllSearchClasses = (classeName: string) => {
        const [classes, setClasses] = useState<Classe[]>([])
        const fetch = useRawFetch()

        useEffect(() => {
            if (classeName)
                fetch(getAllSearchClasses, [schoolId, classeName])
                    .then(resp => {
                        if (resp.isSuccess) {
                            setClasses(resp.data as Classe[])
                        }
                    }
                )
        }, [classeName, fetch]);

        return classes
    }

    const getSearchedClasses = async (classeName: string) => {
        return await getAllSearchClasses(schoolId as string, classeName)
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
            fetch(getClassesBasicValues, [schoolId])
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
        getPaginatedClasses,
        useGetAllSearchClasses,
        getSearchedClasses,
        useGetClasse,
        useGetClasseBasicValues
    }
}

const sortedField = (sortField: string | string[]) => {
    switch (setSortFieldName(sortField)) {
        case 'name':
            return 'c.name'
        default:
            return undefined;
    }
}