import {useFetch, useRawFetch} from "../useFetch.ts";
import {
    getAllClasses, getAllClassesByTeacher,
    getAllSearchClasses, getAllSearchClassesByTeacher,
    getClasse,
    getClassesBasicValues, updatePrincipalCourse
} from "@/data/repository/classeRepository.ts";
import {useEffect, useState} from "react";
import {Classe} from "@/entity";
import {getShortSortOrder, setSortFieldName} from "@/core/utils/utils.ts";
import {useGlobalStore} from "@/core/global/store.ts";
import {UserPermission} from "@/core/shared/sharedEnums.ts";
import {useAuth} from "@/hooks/useAuth.ts";
import {useMutation} from "@tanstack/react-query";

export const useClasseRepo = (context: UserPermission = UserPermission.ALL) => {
    const schoolId = useGlobalStore(state => state.schoolId)

    const useGetPaginated = () => {
        const {user} = useAuth()

        return{
            getPaginatedClasses: async (page: number, size: number, sortField?: string, sortOrder?: string) => {
                if (sortField && sortOrder) {
                    sortOrder = getShortSortOrder(sortOrder)
                    sortField = sortedField(sortField);
                    switch (context) {
                        case UserPermission.ALL:
                            return await getAllClasses(schoolId as string, {
                                page: page,
                                size: size
                            }, `${sortField}:${sortOrder}`);
                        case UserPermission.TEACHER:
                            return await getAllClassesByTeacher(schoolId, user?.userId as string, {
                                page: page,
                                size: size
                            }, `${sortField}:${sortOrder}`)
                    }
                }
                switch (context) {
                    case UserPermission.ALL:
                        return await getAllClasses(schoolId as string, {page: page, size: size})
                    case UserPermission.TEACHER:
                        return await getAllClassesByTeacher(schoolId, user?.userId as string, {
                        page: page,
                        size: size
                    })
                }
            },
            getSearchedClasses: async (classeName: string) => {
                switch (context) {
                    case UserPermission.TEACHER:
                        return await getAllSearchClassesByTeacher(schoolId as string, user?.userId as string, classeName)
                    case UserPermission.ALL:
                        return await getAllSearchClasses(schoolId as string, classeName)
                }
            }
        }
    }

    const useGetClasse = (classeId: number, academicYear: string, isBasic?: boolean) => useFetch(
        ['classe', classeId, academicYear, isBasic],
        getClasse,
        isBasic ? [classeId, academicYear, isBasic] : [classeId, academicYear],
        isBasic ? !!classeId && isBasic : !!classeId && !!academicYear
    )

    const useGetClasseBasicValues = (enabled: boolean = true) => {
        const [classes, setClasses] = useState<Classe[]>([])
        const fetch = useRawFetch()

        useEffect(() => {
            if (enabled)
                fetch(getClassesBasicValues, [schoolId])
                .then(resp => {
                        if (resp.isSuccess) {
                            setClasses(resp.data as Classe[])
                        }
                    }
                )
        }, [enabled, fetch]);

        return classes
    }

    const useUpdateClasseCourse = (classeId: number) => useMutation({
        mutationFn: async ({courseId}: {courseId: number}) => await updatePrincipalCourse(classeId, courseId),
    })

    const classes = useGetClasseBasicValues()
    const countClasses = classes?.length ?? 0

    return {
        useGetPaginated,
        useGetClasse,
        useGetClasseBasicValues,
        useUpdateClasseCourse,
        classes,
        countClasses
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