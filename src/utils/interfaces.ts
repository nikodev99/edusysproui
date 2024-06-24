import {Control, FieldErrors} from "react-hook-form";
import {z} from "zod";
import {enrollmentSchema, guardianSchema} from "../schema";
import {ValidateStatus} from "antd/es/form/FormItem";
import {ReactNode} from "react";
import {Guardian} from "../entity";

export interface Metadata {
    title: string;
    description: string;
}

export type GuardianSchema = z.infer<typeof guardianSchema>;
export type EnrollmentSchema = z.infer<typeof enrollmentSchema>;

type NestedKeyOf<ObjectType extends object> = {
    [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
        ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
        : `${Key}`;
}[keyof ObjectType & (string | number)];

export type TName = NestedKeyOf<EnrollmentSchema>;

export interface ZodProps {
    control: Control<EnrollmentSchema>
    errors: FieldErrors<EnrollmentSchema>
    validationTriggered?: boolean,
    showField?: boolean
}

export interface HealthProps extends ZodProps{
    healthProps: [{
        conditions: string[],
        allergies: string[],
        medications: string[]
    }]
}

export interface GuardianProps extends ZodProps {
    checked: boolean
    value?: string
    onChecked: () => void
    setValue: (newValue: string) => void
    isExists: boolean
    setIsExists: (exists: boolean) => void
    guardian: Guardian
    setGuardian: (guardian: Guardian) => void
}

export interface ZodControl {
    control: Control<EnrollmentSchema>
    label?: string
    name: TName
    validateStatus?: ValidateStatus
    help?: ReactNode
}

export interface ZodListControl {
    name: string
    label: string
    zodProps: ZodControl
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