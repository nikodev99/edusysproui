import {Control, FieldErrors} from "react-hook-form";
import {z} from "zod";
import {studentSchema} from "../schema";
import {ValidateStatus} from "antd/es/form/FormItem";
import {ReactNode} from "react";

export interface Metadata {
    title: string;
    description: string;
}

export interface ZodProps {
    control: Control<z.infer<typeof studentSchema>>
    errors: FieldErrors<z.infer<typeof studentSchema>>
    validationTriggered?: boolean
}

export interface ZodControl {
    control: Control<z.infer<typeof studentSchema>>
    label: string
    name: 'nationality' | 'address.country'
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