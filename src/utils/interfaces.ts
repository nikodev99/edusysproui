import {Control, FieldErrors} from "react-hook-form";
import {z} from "zod";
import {enrollmentSchema} from "../schema";
import {ValidateStatus} from "antd/es/form/FormItem";
import {ReactNode} from "react";

export interface Metadata {
    title: string;
    description: string;
}

export interface ZodProps {
    control: Control<z.infer<typeof enrollmentSchema>>
    errors: FieldErrors<z.infer<typeof enrollmentSchema>>
    validationTriggered?: boolean,
    showField?: boolean
}

export interface ZodControl {
    control: Control<z.infer<typeof enrollmentSchema>>
    label: string
    name: 'student.nationality' | 'student.address.country' | 'student.guardian.nationality' | 'student.guardian.country'
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