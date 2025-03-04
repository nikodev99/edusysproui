import {
    Control as HookControl,
    FieldErrors,
    FieldValues,
    Path,
    PathValue,
    UseFormStateReturn,
    ControllerFieldState,
    ControllerRenderProps,
    FieldPath, UseFormClearErrors,
} from "react-hook-form";
import {ValidateStatus} from "antd/es/form/FormItem";
import React, {CSSProperties, ReactNode} from "react";
import {AcademicYear, Guardian, Student, Teacher} from "../entity";
import {SectionType} from "../entity/enums/section.ts";
import {Gender} from "../entity/enums/gender.tsx";
import {AttendanceStatus} from "../entity/enums/attendanceStatus.ts";
import {Employee} from "../entity/domain/employee.ts";
import {AddressOwner, IndividualType} from "../core/shared/sharedEnums.ts";
import {CalendarProps, Event, View, ViewsProps} from "react-big-calendar";
import {ReprimandType} from "../entity/enums/reprimandType.ts";
import {PunishmentType} from "../entity/enums/punishmentType.ts";
import {PunishmentStatus} from "../entity/enums/punishmentStatus.ts";
import {Day} from "../entity/enums/day.ts";
import {AxiosResponse} from "axios";
import IntrinsicElements = React.JSX.IntrinsicElements;
import {PercentPositionType, ProgressSize} from "antd/es/progress/progress";
import {TableColumnsType, TableProps} from "antd";
import {ItemType} from "antd/es/menu/interface";
import {Individual} from "../entity/domain/individual.ts";

export interface Metadata {
    title: string
    description: string
    hasEdu?: boolean
}

export type ID = string | bigint | number
export type IDS = {
    classId: number
    courseId: number
}

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
    clearErrors?: UseFormClearErrors<FieldValues>
}

export interface ZodProps<T extends FieldValues> {
    control: HookControl<T>
    errors: FieldErrors<T>
    clearErrors?: UseFormClearErrors<T>
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
    age: number
    lastEnrolledDate: Date | number
    classe: string
    grade: SectionType | string
    image: string
}

export interface DataProps {
    id?: string | number
    lastName?: string
    firstName?: string
    gender?: Gender
    image?: string
    reference?: string
    tag?: string | ReactNode
    description?: string | ReactNode | string[] | ReactNode[]
}

export interface ListViewerProps<TData extends object, TError> {
    callback: () => Promise<AxiosResponse<TData | TData[], TError>>
    searchCallback: (...args: unknown[]) => Promise<AxiosResponse<TData[]>>
    tableColumns?: TableColumnsType<TData>
    dropdownItems?: (url: string) => ItemType[]
    throughDetails?: (id: string) => void
    hasCount?: boolean,
    countTitle?: string,
    fetchId?: string | string[]
    localStorage?: {activeIcon?: string, pageSize?: string, page?: string, pageCount?: string}
    cardNotAvatar?: boolean
    cardData?: (data: TData[]) => DataProps[]
    level?: number
    refetchCondition?: boolean
    callbackParams?: unknown[]
    searchCallbackParams?: unknown[]
    infinite?: boolean
    uuidKey?: keyof TData | string[]
    tableProps?: TableProps
}

export interface ExamData {
    examId?: number
    examDate: string;
    examName: string;
    classe: string;
    subject: string
    obtainedMark: number;
}

export interface AutoScrollProps {
    isLoading: boolean
    allItems: number
    loadMoreSize: () => void
    size: number
    height?: number
    infinite?: boolean
    seconds?: number
}

export interface ReprimandData {
    key?: number
    studentId: number
    studentName?: string
    studentClasse?: string
    studentSection?: string
    reprimandDate?: Date | number[] | string
    reprimandType?: ReprimandType
    description?: string
    issueBy?: string
    punishmentId?: number
    isRequired?: boolean
    punishmentType?: PunishmentType,
    punishmentDescription?: string
    punishmentDates?: string
    punishmentStatus?: PunishmentStatus
    appealed?:boolean
    executedBy?: string
    appealedNote?:string
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

export interface InfoPageProps<T extends object> {
    infoData: T
    dataKey: string
    seeMore?: (key: string) => void
    color?: string
    viewLink?: string
    academicYear?: string
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
export type Counted = Record<string, number>
export type GenderCounted = {gender: Gender, count: number, ageAverage: number}
export type CountType = {classe?: string, count?: number};
export type AttendanceCount = {status: AttendanceStatus, count: number}
export type AttendanceSummary = {individual: Individual, statusCount: AttendanceCount[]}
export type AttendanceRecentCount = {
    date: string
    present: number
    absent: number
    late: number
    excused: number
}

export type AttendanceStatusCount = {
    present: number
    absent: number
    late: number
    excused: number
}

export type WidgetItem = {
    title: ReactNode
    value: number | string
    bottomValue?: ReactNode
    precision?: number
    valueStyle?: CSSProperties
    prefix?: ReactNode
    suffix?: ReactNode
    hasShadow?: boolean
    progress?: {
        active: boolean
        status?: string
        type?: string
        percent?: number
        color?: string
        percentPosition?: PercentPositionType
        size?: number | [string | number, number] | ProgressSize | {width?: number | undefined, height?: number | undefined } | undefined
    }
}

export interface WidgetProps {
    items: WidgetItem[]
    hasShadow?: boolean
    responsiveness?: boolean
}

export type TabItemType = {
    closeIcon?: ReactNode
    destroyInactiveTabPane?: boolean
    disabled?: boolean
    forceRender?: boolean
    key?: string
    label?: ReactNode
    icon?: ReactNode
    children?: ReactNode
    closable?: boolean
}

export type CustomUpdateProps = {
    data: Student | Teacher | Employee | Guardian,
    open?: boolean, close?: () => void,
    personal: AddressOwner | IndividualType,
    setSuccessMessage: (msg: string | undefined) => void,
    setErrorMessage: (msg: string | undefined) => void
}

export interface ApiEvent<T extends object> {
    dayOfWeek: Day
    event: string | ReactNode
    allDay: boolean
    startTime: [number, number]
    endTime: [number, number]
    resource?: T
}

export type CalendarEvent = CalendarProps['events']
export type EventProps = Event

export interface BigCalendarProps<TEvents extends object = Event> {
    data: TEvents[]
    views: ViewsProps<TEvents>
    defaultView: View
    startDayTime?: number[]
    endDayTime?: [number, number]
    className?: string
    styles?: CSSProperties
    onSelectEvent?: (event: TEvents) => void
    start?: keyof TEvents
    end?: keyof TEvents
    showNavButton?: boolean
    height?: number
}

export type TabFunction<T> = (teacherId: string, ids: IDS, pageable?: Pageable) => Promise<AxiosResponse<T>>

export type DateExplose = {
    day: number
    month: number
    year: number
    hour?: number
    minute?: number
    second?: number
}

export interface TableSearchProps {
    searchInput?: boolean
}

export interface MasonryProps {
    columns?: number
    gap?: number
    itemTag?: keyof IntrinsicElements
    sequential?: boolean
    children: ReactNode[]
}