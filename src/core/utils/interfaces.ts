import {
    Control as HookControl,
    FieldErrors,
    FieldValues,
    Path,
    PathValue,
    UseFormStateReturn,
    ControllerFieldState,
    ControllerRenderProps,
    FieldPath, UseFormClearErrors, UseFormReturn,
} from "react-hook-form";
import {ValidateStatus} from "antd/es/form/FormItem";
import React, {CSSProperties, ReactNode} from "react";
import {AcademicYear, Assignment, Course, Guardian, Student, Teacher, Employee, Individual, School} from "../../entity";
import {SectionType} from "../../entity/enums/section.ts";
import {Gender} from "../../entity/enums/gender.tsx";
import {AttendanceStatus} from "../../entity/enums/attendanceStatus.ts";
import {AddressOwner, IndividualType} from "../shared/sharedEnums.ts";
import {CalendarProps, Event, SlotInfo, View, ViewsProps} from "react-big-calendar";
import {ReprimandType} from "../../entity/enums/reprimandType.ts";
import {PunishmentType} from "../../entity/enums/punishmentType.ts";
import {PunishmentStatus} from "../../entity/enums/punishmentStatus.ts";
import {Day} from "../../entity/enums/day.ts";
import {AxiosError, AxiosResponse} from "axios";
import {PercentPositionType, ProgressSize} from "antd/es/progress/progress";
import {CheckboxOptionType, TableColumnsType, TableProps} from "antd";
import {ItemType} from "antd/es/menu/interface";
import {z} from "zod";
import {AssignmentTypeLiteral} from "../../entity/enums/assignmentType.ts";
import {RadioGroupButtonStyle, RadioGroupOptionType} from "antd/es/radio";
import {DefaultOptionType} from "antd/es/select";
import {ButtonType} from "antd/es/button";
import {UseMutationOptions} from "@tanstack/react-query";
import {Variant} from "antd/es/config-provider";
import {NavigateOptions} from "react-router-dom";

export interface Metadata {
    title: string
    description: string
    hasEdu?: boolean
}

export type ID = string | bigint | number
export type IDS = {
    classId: number
    courseId?: number
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
    label?: string | ReactNode
    validateStatus?: ValidateStatus
    help?: ReactNode
    style?: CSSProperties
    required?: boolean
}

export type FormType<T extends FieldValues> = ZodFormItemProps & ZodControl<T>
export type FormItemType<T extends FieldValues> = FormType<T> & ZodControlRender<T> & Control<T>
export type TypedInputType<T extends FieldValues> = Control<T> & FormType<T> & InputProps & ZodSelect<T> & ZodRadio<T> &
    ZodListControl<T> & {wrapper?: ReactNode, hide?: boolean}
export type InputType<T extends FieldValues> = TypedInputType<T> & {isCompact?: boolean}
export type SelectType<T extends FieldValues> = TypedInputType<T> & { isCompact?: boolean, }
export type DatePickerType<T extends FieldValues> = TypedInputType<T> & {isCompact?: boolean, showTime?: boolean, format?: string}
export type TimeInputType<T extends FieldValues> = TypedInputType<T> & {isCompact?: boolean}
export type DataType<TData> = TData;
export type DataIndex<TData> = keyof DataType<TData>

export interface ZodControl<TFieldValues extends FieldValues> {
    name: Path<TFieldValues>
    defaultValue?: PathValue<TFieldValues, Path<TFieldValues>> | unknown,
    key?: ID
}

export type UseQueryOptions<TData, TParams extends readonly unknown[] = []> = Omit<
    UseMutationOptions<
        AxiosResponse<TData>,
        AxiosError,
        MutationPostVariables<TData, TParams>
    >, "mutationFn">

export type PostFunction<TData, TParams extends readonly unknown[] = []> = (data: TData, ...params: TParams) => Promise<AxiosResponse<TData>>

export type PutFunction<TData, TParams extends readonly unknown[] = []> = (data: TData, id?: ID, ...params: TParams) => Promise<AxiosResponse<TData, unknown>>

export type MutationPostVariables<TData, TParams extends readonly unknown[]> = {
    postFn: PostFunction<TData, TParams>;
    data: TData;
} & (
    TParams extends readonly [] ? {params?: never} : {params: TParams}
    )

export type MutationPutVariables<TData, TParams extends readonly unknown[]> = {
    putFn: PutFunction<TData, TParams>;
    data: TData;
    id?: ID
} & (
    TParams extends readonly [] ? {params?: never} : {params: TParams}
    )

export type ReturnType<T extends object | boolean> = Promise<{
    success: boolean;
    data?: T;
    error?: unknown
    status?: number;
    code?: string
}>

export type InsertReturnType<TData extends object | boolean> = ReturnType<TData>
export type UpdateReturnType<TData extends object | boolean> = ReturnType<TData>

type InsertFunction<TData, TReturn extends object | boolean, TParams extends readonly unknown[] = []> = {
    insert: (data: TData, params: TParams) => InsertReturnType<TReturn>
}

type UpdateFunction<TData, TReturn extends object | boolean, TParams extends readonly unknown[] = []> = {
    update: (data: TData, id?: ID, params?: TParams) => InsertReturnType<TReturn>
}

type UseQueryReturn <
    TReturn extends object | boolean,
> = {
    result?: TReturn,
    error?: unknown,
    isLoading?: boolean,
    isError?: boolean,
    failureReason?: AxiosError | null
}

export type UseInsertReturn<
    TData,
    TReturn extends object | boolean,
    TParams extends readonly unknown[] = []
> = UseQueryReturn<TReturn> & InsertFunction<TData, TReturn, TParams>

export type UseUpdateReturn<
    TData,
    TReturn extends object | boolean,
    TParams extends readonly unknown[] = []
> = UseQueryReturn<TReturn> & UpdateFunction<TData, TReturn, TParams>

export interface ZodControlRender<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> {
    render: ({ field, fieldState, formState, }: {
        field: ControllerRenderProps<TFieldValues, TName>;
        fieldState: ControllerFieldState;
        formState: UseFormStateReturn<TFieldValues>;
    }) => React.ReactElement;
}

export interface ZodSelect<T extends FieldValues> {
    options?: Options,
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

export interface ZodRadio<T extends FieldValues> {
    optionType?: RadioGroupOptionType
    buttonStyle?: RadioGroupButtonStyle
    style?: CSSProperties
    radioOptions?: CheckboxOptionType<T>[],
    isValueObject?: boolean
}

export interface InputProps extends ZodFormItemProps {
    placeholder?: string
    xs?: number
    md?: number
    lg?: number
    hasForm?: boolean
    onFinish?: (values: unknown | unknown[]) => void
    type?: string
    buttonLabel?: ReactNode
    inputType?: string
    addonAfter?: ReactNode,
    min?: number
    max?: number
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

export interface MessageResponse {
    message: string
    description: string
    timestamp: string | Date | number
    isError?: boolean
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

export interface DataProps<TData extends object> {
    id: string | number
    lastName?: string
    firstName?: string
    gender?: Gender
    image?: string
    reference?: string
    tag?: string | ReactNode
    description?: string | ReactNode | string[] | ReactNode[]
    record: TData
}

export type ListViewerProps<TData extends object, TError> = ListProps<TData> & {
    callback: () => Promise<AxiosResponse<TData | TData[], TError>>
    searchCallback?: (...args: unknown[]) => Promise<AxiosResponse<TData[]>>
    hasCount?: boolean,
    countTitle?: string,
    fetchId?: string | string[]
    callbackParams?: unknown[]
    searchCallbackParams?: unknown[]
}

export interface ListProps<TData extends object> {
    tableColumns?: TableColumnsType<TData>
    tableHeight?: number
    displayItem?: 1 | 2 | 3 | 4,
    dropdownItems?: (url?: string, record?: TData) => ItemType[]
    throughDetails?: (id: string | number, record?:TData) => void
    localStorage?: {activeIcon?: string, pageSize?: string, page?: string, pageCount?: string}
    cardNotAvatar?: boolean
    cardData?: (data: TData[]) => DataProps<TData>[]
    level?: 1 | 2 | 3 | 4 | 5
    hasSearch?: boolean
    searchInput?: boolean
    refetchCondition?: boolean
    infinite?: boolean
    uuidKey?: keyof TData | string[]
    tableProps?: TableProps
    itemSize?: number
    descMargin?: {
        position?: "top" | "bottom" | "left" | "right"
        size?: number | string
    }
    filters?: ReactNode
    shareSearchQuery?: (value: string | undefined) => void
    showFilterAction?: (value: boolean) => void
    onSelectData?: (data: TData) => void
    dataDescription?: ReactNode
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

export interface ExamView {
    id?: ID
    student: Student
    type: TypedAssignment[],
    totalAverage: number
    rank: number
    nested: NestedExamView
}

export interface NestedExamView {
    subject?: Course | string
    assignments?: Assignment[]
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

export interface AutoScrollProps {
    isLoading: boolean
    allItems: number
    loadMoreSize: () => void
    size: number
    height?: number
    infinite?: boolean
    seconds?: number
}

export interface LoadMoreListProps<T extends object> {
    listProps: ListProps<T>
    isLoading: boolean,
    size: number,
    allItems: number,
    onLoadMore?: () => void
    buttonType?: ButtonType
    buttonLabel?: ReactNode
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

export interface SortCriteria<T extends object> {
    sortField?: keyof T
    sortOrder?: 'asc' | 'desc'
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
    isLoading?: boolean
    data: TData
    resp?: (resp: Record<string, boolean>) => void
}

export type RedirectFunction = (link: string, option?:NavigateOptions) => void;
export type Moment = Date | number[] | string
export type Color = string
export type Counted = Record<string, number>
export type GenderCounted = {
    total: number,
    totalAverageAge: number
    genders: {
        gender: Gender,
        count: number,
        ageAverage: number
    }[]
}
export type CountType = {classe?: string, count?: number};
export type AttendanceCount = {status: AttendanceStatus, count: number, classeId?: number}
export type AttendanceSummary = {individual: Individual, statusCount: AttendanceCount[], totalDays: number, classe?: string}
export type AttendanceRecentCount = {
    date: string
    present: number
    absent: number
    late: number
    excused: number
}

export type AttendanceStatusKey = keyof typeof AttendanceStatus
export type AttendanceStatusCount = Record<AttendanceStatusKey, number>
export type SectionStatusCount = Partial<Record<SectionType, AttendanceStatusCount>>
export type GenderStatusCount = Partial<Record<Gender, AttendanceStatusCount>>

export type AttendanceInfo = {
    present: number
    absent: number
    late: number
    excused: number
}

export interface AttendanceStatusCountResponse {
    statusCount: AttendanceStatusCount;
    sectionStatusCount: SectionStatusCount;
    genderStatusCount: GenderStatusCount;
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
        active?: boolean
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
    data: Student | Teacher | Employee | Guardian | School,
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
    startDate?: Date | string | number[]
    endDate?: Date | string | number[]
    className?: string
    styles?: CSSProperties
    onSelectEvent?: (event: TEvents) => void
    start?: keyof TEvents
    end?: keyof TEvents
    showNavButton?: boolean
    height?: number
    onSelectSlot?: (slotInfo: SlotInfo) => void
    isLoading ?: boolean
    wrapperColor?: (event: Event) => [Color, Color]
    selectable?: boolean
}

export type TabFunction<T> = (teacherId: string, ids: IDS, pageable?: Pageable) => Promise<AxiosResponse<T>>

export type ScheduleHoursBy = {name: string, totalHours: number}

export type DateExplose = {
    day: number
    month: number
    year: number
    hour?: number
    minute?: number
    second?: number
}

export interface SchemaProps<TData extends FieldValues> {
    data: z.ZodSchema<TData>;
    messageSuccess?: ReactNode;
    description?: string;
    explain?: string;
    marquee?: boolean;
    customForm: ReactNode
    handleForm: UseFormReturn<TData>
    toReset?: boolean
}

export interface PostSchemaProps<TData extends FieldValues> {
    postFunc: (data: TData) => Promise<AxiosResponse<TData>>
}

export interface PutSchemaProps<TData extends FieldValues, TReturn> {
    putFunc: (data: TData, id: ID) => Promise<AxiosResponse<TReturn, unknown>>
}

export type Option = DefaultOptionType
export type Options = Option[]

export type ActionsButtons = {
    createUser?: boolean
    addRoles?: boolean
}

export interface ActionLinksProps<TButtonAction extends object> {
    open: TButtonAction
    setActions: (actions: TButtonAction) => void
    show: TButtonAction
    personalInfo?: Individual
}

export interface TableSearchProps {
    searchInput?: boolean
}

export interface SelectEntityProps<
    Entity extends object,
    EntityID extends string | number | number[]
> {
    variant?: Variant
    onlyCurrent?: boolean | EntityID
    placeholder?: ReactNode
    isLoading?: boolean
    multiple?: boolean
    defaultValue?: EntityID | EntityID[]
    getResource?: (resource: Entity | Entity[]) => void
}

export type SelectEntity<
    Entity extends object,
    EntityID extends string | number | number[],
> = {
    data: Entity[]
    getEntity: (value: EntityID | EntityID[]) => void
    options: {id: keyof Entity, label: keyof Entity}
    uniqueValue: { key?: keyof Entity, value: unknown }
    entities?: Entity[]
    width?: number | string
} & SelectEntityProps<Entity, EntityID>

export interface RepoOptions {
    shouldRefetch?: boolean
    enable?: boolean
}

export interface StoreState<TData extends object> {
    all: TData[]
    one: TData
    current?: TData
    options?: Options
    loading?: boolean
    error?: unknown
    fetchAll?: () => Promise<AxiosResponse<TData[], unknown>>
    searchAll?: (input?: string) => Promise<AxiosResponse<TData[], unknown>>
}