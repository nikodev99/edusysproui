import {Control, FieldErrors} from "react-hook-form";
import {z} from "zod";
import {inscriptionSchema} from "../schema";

export interface Metadata {
    title: string;
    description: string;
}

export interface ZodProps {
    control: Control<z.infer<typeof inscriptionSchema>>
    errors: FieldErrors<z.infer<typeof inscriptionSchema>>
    validationTriggered: boolean
}

export interface EnumType {
    [key: string]: number | string
}