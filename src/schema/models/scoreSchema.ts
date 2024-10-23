import {z} from "zod";
import {studentSchema} from "./studentSchema.ts";
import {fDate} from "../../utils/utils.ts";
import {Score} from "../../entity";
import {examSchema} from "./examSchema.ts";

export const scoreSchema = z.lazy(() => z.object({
    id: z.bigint().optional(),
    exam: examSchema,
    student: studentSchema.optional(),
    obtainedMark: z.number()
}))

export const initExamData = (scores: Score[]) => {
    return scores?.map((s) => ({
        examId: s.exam.id as number,
        examDate: fDate(s.exam?.examDate) ?? '' as string,
        examName: s.exam?.examName ?? '' as string,
        classe: s.exam?.classe?.name ?? '' as string,
        obtainedMark: s.obtainedMark ?? 0 as number
    })) ?? []
}