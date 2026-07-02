import {apiClient} from "../axiosConfig.ts";
import {Pageable} from "@/core/utils/interfaces.ts";
import {getShortSortOrder} from "@/core/utils/utils.ts";
import {ReprimandSchema} from "@/schema";
import {Reprimand} from "@/entity";
import {ReprimandFilterProps} from "@/entity/domain/reprimand.ts";

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
    return apiClient.get<Reprimand[]>(`/blame/teacher_some/${teacherId}`)
}

export const getAllStudentReprimandedByTeacher = (
    teacherId: number,
    filter: ReprimandFilterProps,
    pageable?: Pageable,
    sortField?: string,
    sortOrder?: string) => {
    if (sortField && sortOrder) {
        sortOrder = getShortSortOrder(sortOrder)
        sortField = sortedField(sortField)
    }
    return apiClient.get(`/blame/teacher_all/${teacherId}`, {
        params: {
            academicYear: filter.academicYear,
            page: pageable?.page,
            size: pageable?.size,
            sortCriteria: sortField && sortOrder ? `${sortField}:${sortOrder}` : 'reprimandDate:desc',
            ...(filter.punishmentType ? { punishmentType: filter.punishmentType } : {}),
            ...(filter.reprimandType ? { reprimandType: filter.reprimandType } : {}),
            ...(filter.punishmentStatus ? { punishmentStatus: filter.punishmentStatus } : {}),
            ...(filter.reprimandBetween ? { reprimandBetween: filter.reprimandBetween } : {}),
        }
    })
}

const sortedField = (sortField: string) => {
    switch (sortField) {
        case 'type':
            return 'type'
    }
}