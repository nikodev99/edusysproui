import {
    Control as HookControl,
    FieldErrors,
    FieldValues,
    Path,
    PathValue,
    UseFormStateReturn,
    ControllerFieldState,
    ControllerRenderProps,
    FieldPath,
} from "react-hook-form";
import {z} from "zod";
import {enrollmentSchema, guardianSchema, studentSchema, teacherSchema} from "../schema";
import {ValidateStatus} from "antd/es/form/FormItem";
import React, {CSSProperties, ReactNode} from "react";
import {AcademicYear, Guardian} from "../entity";
import {SectionType} from "../entity/enums/section.ts";
import {Gender} from "../entity/enums/gender.ts";
import {AttendanceStatus} from "../entity/enums/attendanceStatus.ts";
import {addressSchema} from "../schema/models/addressSchema.ts";
import {healthSchema} from "../schema/models/healthSchema.ts";
import {teacherClassCourseSchema} from "../schema/models/teacherClassCourseSchema.ts";

export interface Metadata {
    title: string
    description: string
    hasEdu?: boolean
}

export type GuardianSchema = z.infer<typeof guardianSchema>
export type EnrollmentSchema = z.infer<typeof enrollmentSchema>
export type StudentSchema = z.infer<typeof studentSchema>
export type AddressSchema = z.infer<typeof addressSchema>
export type HealthSchema = z.infer<typeof healthSchema>
export type TeacherSchema = z.infer<typeof teacherSchema>
export type TeacherClassCourseSchema = z.infer<typeof teacherClassCourseSchema>;

type NestedKeyOf<ObjectType extends object> = {
    [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
        ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
        : `${Key}`;
}[keyof ObjectType & (string | number)];

export type TName<T extends object> = NestedKeyOf<T>;
export type TFieldValues<T extends object> = NestedKeyOf<T>

export interface BreadcrumbItems {
    title: string | ReactNode,
    path?: string
}

export interface Control<T extends FieldValues> {
    control: HookControl<T>
}

export interface ZodProps<T extends FieldValues> {
    control: HookControl<T>
    errors: FieldErrors<T>
    validationTriggered?: boolean,
    showField?: boolean
}

export interface HealthProps<T extends FieldValues> extends ZodProps<T>{
    healthProps: [{
        conditions: string[]
        allergies: string[]
        medications: string[]
    }]
}

export interface GuardianProps<T extends FieldValues, Q extends object> extends FormContentProps<T, Q> {
    checked: boolean
    value?: string
    onChecked: () => void
    setValue: (newValue: string) => void
    isExists: boolean
    setIsExists: (exists: boolean) => void
    guardian: Guardian
    setGuardian: (guardian: Guardian) => void
}

export interface ZodFormItemProps {
    label?: string
    validateStatus?: ValidateStatus
    help?: ReactNode
    style?: CSSProperties
    required?: boolean
}

export type FormType<T extends FieldValues> = ZodFormItemProps & ZodControl<T>
export type FormItemType<T extends FieldValues> = FormType<T> & ZodControlRender<T> & Control<T>
export type TypedInputType<T extends FieldValues> = Control<T> & FormType<T> & InputProps & ZodSelect<T> & ZodListControl<T> & {wrapper?: ReactNode}
export type InputType<T extends FieldValues> = TypedInputType<T> & {isCompact?: boolean}
export type SelectType<T extends FieldValues> = TypedInputType<T> & {isCompact?: boolean}
export type DatePickerType<T extends FieldValues> = TypedInputType<T> & {isCompact?: boolean}
export type DataType<TData> = TData;
export type DataIndex<TData> = keyof DataType<TData>

export interface ZodControl<TFieldValues extends FieldValues> {
    name: Path<TFieldValues>
    defaultValue?: PathValue<TFieldValues, Path<TFieldValues>>,
}

export interface ZodControlRender<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> {
    render: ({ field, fieldState, formState, }: {
        field: ControllerRenderProps<TFieldValues, TName>;
        fieldState: ControllerFieldState;
        formState: UseFormStateReturn<TFieldValues>;
    }) => React.ReactElement;
}

export interface ZodSelect<T extends FieldValues> {
    options?: {value: string | number, label: string | number}[],
    selectedValue?: PathValue<T, Path<T>>
    filterOption?: boolean | ((input: string, option?: { label: string, value: string }) => boolean) | undefined
    showSearch?: boolean
    defaultActiveFirstOption?: boolean
    suffixIcon?: ReactNode,
    onSearch?:  ((value: string) => void) | undefined
    onChange?:  ((value: string, option?: ({label: string, value: string | number } | {label: string, value: string | number }[])) => void) | undefined
    notFoundContent?: ReactNode
    mode?:  "tags" | "multiple"
}

export interface InputProps extends ZodFormItemProps {
    placeholder?: string
    xs?: number
    md?: number
    lg?: number
    hasForm?: boolean
    onFinish?: (values: unknown) => void
    type?: string
    buttonLabel?: ReactNode
    inputType?: string
    addonAfter?: ReactNode,
    min?: number
    disabled?: boolean,
}

export interface ZodListControl<T extends FieldValues> extends ZodControl<T>{
    listName?: string | number | (string | number)[]
    dataField?: string
}

export interface FormContentProps<T extends FieldValues, Q extends object> extends ZodProps<T> {
    edit?: boolean
    data?: Q
    enroll?: boolean
}

export interface FormInitialProps<T extends FieldValues> extends ZodProps<T>{

}

export interface EnumType {
    [key: string]: number | string
}

export interface AxiosConfig {
    method: string;
    url: string;
    params?: object
    data?: object,
    headers?: Record<string, string>
}

export interface StudentListDataType {
    id: string
    academicYear: AcademicYear
    reference: string
    firstName: string
    lastName: string
    gender: Gender
    lastEnrolledDate: Date | number
    classe: string
    grade: SectionType | string
    image: string
}

export interface ExamData {
    examId?: number
    examDate: string;
    examName: string;
    classe: string;
    obtainedMark: number;
}

export interface AttendanceRecord {
    id: number
    date: string
    classe: string
    section: string
    status: ReactNode | AttendanceStatus
}

export interface Pageable {
    page: number,
    size: number,
}

export interface PieProps {
    data: {type: string, value: number}[];
    label?: (obj: object) => string;
    colors?: Color[];
}

export interface EditProps<TData extends object> {
    open: boolean
    close: () => void
    isLoading: boolean
    data: TData
}

export type RedirectFunction = (link: string) => void;
export type Moment = Date | number[] | string
export type Color = string