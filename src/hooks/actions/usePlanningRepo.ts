import {Planning} from "../../entity";
import {useEffect, useState} from "react";
import {useRawFetch} from "../useFetch.ts";
import {getAllPlannings, getGradePlannings, savePlanning} from "../../data/repository/planningRepository.ts";
import {SectionType} from "../../entity/enums/section.ts";
import {useInsert} from "../usePost.ts";
import {planningSchema} from "../../schema";
import {useGlobalStore} from "../../core/global/store.ts";

export const usePlanningRepo = () => {
    const schoolId = useGlobalStore(state => state.schoolId)

    return {
        useSavePlanning: () => useInsert(planningSchema, savePlanning),

        useGetAllPlannings: (academicYear: string): Planning[] => {
            const [plannings, setPlannings] = useState<Planning[]>([])
            const fetch = useRawFetch()

            useEffect(() => {
                if (academicYear)
                    fetch(getAllPlannings, [schoolId, academicYear])
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
                    fetch(getGradePlannings, [schoolId, section])
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