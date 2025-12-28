import {apiClient} from "../axiosConfig.ts";
import {Moment, Pageable} from "@/core/utils/interfaces.ts";
import {PunishmentType} from "@/entity/enums/punishmentType.ts";
import {ReprimandType} from "@/entity/enums/reprimandType.ts";
import {PunishmentStatus} from "@/entity/enums/punishmentStatus.ts";
import {getShortSortOrder} from "@/core/utils/utils.ts";
import {ReprimandSchema} from "@/schema";
import {Reprimand} from "@/entity";

export interface ReprimandFilterProps {
    academicYear: string
    classeId?: number
    punishmentType?: PunishmentType
    reprimandType?: ReprimandType
    punishmentStatus?: PunishmentStatus
    reprimandBetween?: [Moment, Moment]
}

export const createReprimand = (reprimand: ReprimandSchema) => {
    return apiClient.post('/blame', reprimand)
}

export const getAllStudentReprimands = (studentId?: string) => {
    return apiClient.get<Reprimand[]>(`/blame/all/${studentId}`)
}

export const getStudentReprimands = (
    studentId: string,
    filter: ReprimandFilterProps,
    page: number,
    size: number,
    sortField?: string,
    sortOrder?: string
) => {
    if (sortField && sortOrder) {
        sortOrder = getShortSortOrder(sortOrder)
        sortField = sortedField(sortField)
    }
    return apiClient.get(`/blame/${studentId}`, {
        params: {
            academicYear: filter.academicYear,
            page: page,
            size: size,
            sortCriteria: sortField && sortOrder ? `${sortField}:${sortOrder}` : 'reprimandDate:desc',
            ...(filter.classeId ? { classeId: filter.classeId } : {}),
            ...(filter.punishmentType ? { punishmentType: filter.punishmentType } : {}),
            ...(filter.reprimandType ? { reprimandType: filter.reprimandType } : {}),
            ...(filter.punishmentStatus ? { punishmentStatus: filter.punishmentStatus } : {}),
            ...(filter.reprimandBetween ? { reprimandBetween: filter.reprimandBetween } : {}),
        }
    })
}

export const getClasseReprimands = (
    classeId: number,
    filter: ReprimandFilterProps,
    page: number,
    size: number,
    sortField?: string,
    sortOrder?: string
) => {
    if (sortField && sortOrder) {
        sortOrder = getShortSortOrder(sortOrder)
        sortField = sortedField(sortField)
    }
    return apiClient.get(`/blame/classe/${classeId}`, {
        params: {
            academicYear: filter.academicYear,
            page: page,
            size: size,
            sortCriteria: sortField && sortOrder ? `${sortField}:${sortOrder}` : 'reprimandDate:desc',
            ...(filter.punishmentType ? { punishmentType: filter.punishmentType } : {}),
            ...(filter.reprimandType ? { reprimandType: filter.reprimandType } : {}),
            ...(filter.punishmentStatus ? { punishmentStatus: filter.punishmentStatus } : {}),
            ...(filter.reprimandBetween ? { reprimandBetween: filter.reprimandBetween } : {}),
        }
    })
}

export const getSomeStudentReprimandedByTeacher = (teacherId: number) => {
    return apiClient.get(`/blame/teacher_some/${teacherId}`)
}

export const getAllStudentReprimandedByTeacher = (teacherId: number, academicYearId: string, pageable?: Pageable) => {
    return apiClient.get(`/blame/teacher_all/${teacherId}`, {
        params: {
            academicYear: academicYearId,
            page: pageable?.page,
            size: pageable?.size
        }
    })
}

const sortedField = (sortField: string) => {
    switch (sortField) {
        case 'type':
            return 'type'
    }
}