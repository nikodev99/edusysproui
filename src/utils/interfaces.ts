import {Control, FieldErrors} from "react-hook-form";
import {z} from "zod";
import {classeSchema, enrollmentSchema, guardianSchema, studentSchema} from "../schema";
import {ValidateStatus} from "antd/es/form/FormItem";
import {ReactNode} from "react";

export interface Metadata {
    title: string;
    description: string;
}

export type ClasseSchema = z.infer<typeof classeSchema>;
export type GuardianSchema = z.infer<typeof guardianSchema>;
export type StudentSchema = z.infer<typeof studentSchema>;
export type EnrollmentSchema = z.infer<typeof enrollmentSchema>;

type NestedKeyOf<ObjectType extends object> = {
    [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
        ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
        : `${Key}`;
}[keyof ObjectType & (string | number)];

export interface ZodProps {
    control: Control<EnrollmentSchema>
    errors: FieldErrors<EnrollmentSchema>
    validationTriggered?: boolean,
    showField?: boolean
}

export type TName = NestedKeyOf<EnrollmentSchema>;

export interface ZodControl {
    control: Control<EnrollmentSchema>
    label?: string
    name: TName
    validateStatus: ValidateStatus
    help: ReactNode
}

export interface EnumType {
    [key: string]: number | string
}

export interface AxiosConfig {
    method: string;
    url: string;
    data?: object,
    headers?: Record<string, string>
}