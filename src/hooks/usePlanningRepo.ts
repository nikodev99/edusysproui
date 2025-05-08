import {Planning} from "../entity";
import {useEffect, useState} from "react";
import {useRawFetch} from "./useFetch.ts";
import {getAllPlannings, getGradePlannings} from "../data/repository/planningRepository.ts";
import {SectionType} from "../entity/enums/section.ts";

export const usePlanningRepo = () => {
    return {
        useGetAllPlannings: (academicYear: string): Planning[] => {
            const [plannings, setPlannings] = useState<Planning[]>([])
            const fetch = useRawFetch()

            useEffect(() => {
                if (academicYear)
                    fetch(getAllPlannings, [academicYear])
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
                    fetch(getGradePlannings, [section])
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