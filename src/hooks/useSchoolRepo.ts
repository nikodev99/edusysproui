import {loggedUser} from "../auth/jwt/LoggedUser.ts";
import {School} from "../entity";
import {useFetch} from "./useFetch.ts";
import {getSchool, getSchoolSections} from "../data/repository/schoolRepository.ts";
import {SectionType} from "../entity/enums/section.ts";

export const useSchoolRepo = () => {
    const schoolId = loggedUser.getSchool()?.id

    const useGetSchool = (refetch: boolean = false): School | undefined => {
        const schoolRes = useFetch(['school', schoolId], getSchool, [schoolId], !!schoolId)
        if (refetch) {
            schoolRes.refetch().then()
        }
        return schoolRes.data
    }

    const useGetSchoolSections = () => {
        const {data} = useFetch(['sections', schoolId], getSchoolSections, [schoolId], !!schoolId)
        return data || [] as SectionType[]
    }

    const schoolSections = useGetSchoolSections()

    return {
        useGetSchool,
        useGetSchoolSections,
        schoolSections,
    }
}