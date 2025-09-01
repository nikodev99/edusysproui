import {Planning} from "../entity";
import {useEffect, useState} from "react";
import {useRawFetch} from "./useFetch.ts";
import {getAllPlannings, getGradePlannings, savePlanning} from "../data/repository/planningRepository.ts";
import {SectionType} from "../entity/enums/section.ts";
import {loggedUser} from "../auth/jwt/LoggedUser.ts";
import {useInsert} from "./usePost.ts";
import {planningSchema} from "../schema";

export const usePlanningRepo = () => {
    const userSchool = loggedUser.getSchool()

    return {
        useSavePlanning: () => useInsert(planningSchema, savePlanning),

        useGetAllPlannings: (academicYear: string): Planning[] => {
            const [plannings, setPlannings] = useState<Planning[]>([])
            const fetch = useRawFetch()

            useEffect(() => {
                if (academicYear)
                    fetch(getAllPlannings, [userSchool?.id, academicYear])
                        .then(resp => {
                            if (resp.isSuccess) {
                                setPlannings(resp.data as Planning[])
                            }
                        })
            }, [academicYear, fetch]);
            
            return plannings
        },

        useGetGradePlannings: (section?: SectionType): Planning[] => {
            const [plannings, setPlannings] = useState<Planning[]>([])
            const fetch = useRawFetch()

            useEffect(() => {
                if (section)
                    fetch(getGradePlannings, [userSchool?.id, section])
                        .then(resp => {
                            if (resp.isSuccess) {
                                setPlannings(resp.data as Planning[])
                            }
                        })
            }, [fetch, section]);
            
            return plannings
        }
    }
}