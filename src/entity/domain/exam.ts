import {Course, ExamType, Student} from "@/entity";
import {Assignment} from "@/entity";
import {ID, Moment} from "@/core/utils/interfaces.ts";
import {AssignmentTypeLiteral} from "@/entity/enums/assignmentType.ts";
import {AssignmentTypeAverage} from "@/entity/domain/assignment.ts";

export interface Exam {
    id?: number,
    examType?: ExamType
    assignments: Assignment[]
    startDate: Date | number[]
    endDate: Date | number[]
}

export interface ExamData {
    examId?: number
    examDate: string;
    examName: string;
    classe: string;
    subject: string
    obtainedMark: number;
    coefficient: number
}

export interface ExamResponse {
    exam?: Exam
    examView?: ExamView[]
    assignments: Assignment[];
    statistics: ExamStatistics
}

export interface ExamView {
    studentId: ID
    student: Student
    typeAverages: AssignmentTypeAverage[],
    totalAverage: number
    rank: number
    nested: NestedExamView[]
}

export interface NestedExamView {
    subject?: Course | string
    assignments?: Assignment[]
    subjectAverage: number
}

export interface TypedAssignment {
    type: AssignmentTypeLiteral
    average: number
    assignments?: Assignment[]
}

export interface SubjectAssignment {
    subject?: Course | string
    assignments?: Assignment[]
}

export interface ExamStatistics {
    totalAssignments: number
    totalMarks: number;
    successRate: number
    medianAverage: number
}

export interface ExamProgress {
    examName: string,
    average: number,
    examDate: Moment
}