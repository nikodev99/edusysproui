import {Control, FieldErrors} from "react-hook-form";
import {z} from "zod";
import {inscriptionSchema} from "../schema";
import {ValidateStatus} from "antd/es/form/FormItem";
import {ReactNode} from "react";

export interface Metadata {
    title: string;
    description: string;
}

export interface ZodProps {
    control: Control<z.infer<typeof inscriptionSchema>>
    errors: FieldErrors<z.infer<typeof inscriptionSchema>>
    validationTriggered?: boolean
}

export interface ZodControl {
    control: Control<z.infer<typeof inscriptionSchema>>
    label: string
    name: 'nationality' | 'address.country'
    validateStatus: ValidateStatus
    help: ReactNode
}

export interface EnumType {
    [key: string]: number | string
}