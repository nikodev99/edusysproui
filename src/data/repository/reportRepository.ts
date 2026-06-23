import {MessageResponse, Moment} from "@/core/utils/interfaces.ts";
import {ReportSchema} from "@/schema";
import {Report} from "@/entity";
import {apiClient} from "@/data/axiosConfig.ts";

export const reportRepository = {
    saveReport: (report: ReportSchema) => {
        return apiClient.post<MessageResponse>('/report', report)
    },

    getAllWeekReport: (teacherId: string, startDate: Moment, endDate: Moment) => {
        return apiClient.get<Report[]>(`/report/week/${teacherId}`, {
            params: {
                startDate: startDate,
                endDate: endDate
            }
        })
    },

    viewReport: (reportId: number) => {
        return apiClient.get<Report>(`/report/${reportId}`)
    }
}