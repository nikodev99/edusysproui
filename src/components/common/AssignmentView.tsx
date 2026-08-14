import {cloneElement, isValidElement, ReactNode, useEffect, useMemo, useState} from "react";
import {Assignment, Classe, ClasseRanking, Course, GradeRankingStudent} from "@/entity";
import TabItem from "../view/TabItem.tsx";
import {SuperWord} from "../../core/utils/tsxUtils.tsx";
import {Select} from "antd";
import {AssignmentDesc} from "./AssignmentDesc.tsx";
import {UseQueryResult} from "@tanstack/react-query";
import {cutStatement, isString} from "@/core/utils/utils.ts";
import {Moment} from "@/core/utils/interfaces.ts";

interface AssignmentViewProps {
    assignExams: UseQueryResult<Assignment[], unknown>
    getSubject?: (id: number) => void
    classeId?: number
    getClasse?: (id: number) => void
    scoreStats?: GradeRankingStudent[] | ClasseRanking[]
    academicYear?: string | number
    tabViews?: { key: string; label: ReactNode, children?: ReactNode }[]
    selects?: ReactNode[]
    title?: string | ReactNode
    name?: string
    showBarChart?: boolean
    hasLegend?: boolean
    showBest?: boolean
    courses?: Course[]
    classes?: Classe[]
    studentId?: string
    disableSelect?: boolean
    hasPermission?: boolean
    label?: string
    calendarLimit?: {
        startDate?: Moment
        endDate?: Moment
    }
    showOnlyBestTable?: boolean
}

const AssignmentView = (
    {
        assignExams, scoreStats, tabViews, title, name, showBarChart, hasLegend, showBest = true, getSubject, hasPermission,
        getClasse, courses, classes, selects, studentId, disableSelect, label = 'Evaluation', calendarLimit, showOnlyBestTable
    }: AssignmentViewProps
) => {
    const [assignments, setAssignments] = useState<Assignment[] | null>(null)
    const [subjectValue, setSubjectValue] = useState<number>(courses && courses?.length > 0 ? courses[0].id as number : 0)
    const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
    const [selectedClasse, setSelectedClasse] = useState<string | null>(null)
    const [selectedTabKey, setSelectedTabKey] = useState<string | undefined>('assignment-list')
    const [classeValue, setClasseValue] = useState<number>(classes && classes?.length > 0 ? classes[0].id as number : 0)
    const [loading] = useState<boolean>(false);

    const courseExists: boolean = courses && courses?.length > 0 || false

    const {data, isSuccess, refetch, isFetching, isRefetching, isLoading: isFetchLoading, isPending} = assignExams

    const subjects = useMemo(() => {
        return courseExists ? courses?.map(c => ({
            value: c.id, label: c.course
        })) : []
    }, [courseExists, courses])

    const classrooms = useMemo(() => {
        return classes?.map(c => ({
            value: c.id, label: <SuperWord input={c.name} isSpan />
        }))
    }, [classes])
    
    const selectPoints = useMemo((): ReactNode[] => {
        return selects && selects?.length > 0 ? selects?.map((select, index) => {
            if (isValidElement(select)) {
                return cloneElement(select, {key: `select-${index}`})
            }
            return select
        }): []
    }, [selects])

    const isLoading = useMemo(() => {
        return isFetching || isRefetching || isFetchLoading || isPending
    }, [isFetchLoading, isFetching, isPending, isRefetching]);
    
    const bestStudent = useMemo(() => scoreStats && scoreStats?.length > 0 ? scoreStats : null, [scoreStats])

    const disabledSelect = useMemo(() => 
            selectedTabKey === 'exam-list' || 
            (disableSelect && selectedTabKey === 'assignment-list'), 
        [disableSelect, selectedTabKey]
    )
    
    const allSubjects = useMemo(() => {
            if (!courseExists) {
                const seen = new Map<number | undefined, string | undefined>()
                seen.set(0, "Tous");

                (assignments as Assignment[])?.forEach(a => {
                    if (!seen.has(a?.subject?.id)) {
                        seen.set(a?.subject?.id, cutStatement(a?.subject?.course as string, 15, a.subject?.abbr))
                    }
                });

                return Array.from(seen.entries()).map(([value, label]) => ({value, label}))
            }
            return []
    }, [assignments, courseExists])

    useEffect(() => {
        if (isSuccess) {
            setAssignments(data as Assignment[])
        }

    }, [courseExists, data, isSuccess]);

    const handleSubjectValue = (value: number) => {
        setSubjectValue(prev => prev === value ? prev : value)
        setSelectedSubject((allSubjects ?? subjects)?.find(s => s.value === value)?.label ?? null)
        getSubject?.(value)
        refetch()?.then(r => r.data)
    }
    
    const handleClasseValue = (value: number) => {
        setClasseValue(prev => prev === value ? prev : value)
        setSelectedClasse(classes?.find(c => c.id === value)?.name ?? null)
        getClasse?.(value)
        refetch()?.then(r => r.data)
    }

    const handleConfirmation = () => {
        refetch().then(r => r.data)
    };

    const changeTab = (activeKey: string) => {
        setSelectedTabKey(activeKey)
    }

    return (
        <>
            <TabItem
                title={isString(title) ? <SuperWord input={title} /> : title}
                selects={[
                    ...((allSubjects && allSubjects?.length > 0) || (subjects && subjects?.length > 0) ? [(<Select
                        style={{width: 150}}
                        key='select-subject'
                        className='select-control'
                        defaultValue={subjectValue}
                        options={(allSubjects ?? subjects) as []}
                        onChange={handleSubjectValue}
                        variant='borderless'
                        disabled={!disabledSelect ? !!(disableSelect && disabledSelect) : disabledSelect}
                    />)]: []),
                    ...(classes && classes?.length > 0 ? [(<Select
                        style={{width: 150}}
                        key='select-classe'
                        className='select-control'
                        defaultValue={classeValue}
                        options={classrooms}
                        onChange={handleClasseValue}
                        variant='borderless'
                    />)]: []),
                    ...selectPoints
                    //TODO Adding the filtre by semester
                ]}
                stickTab={true}
                items={[
                    {
                        key: 'assignment-list',
                        label: label,
                        children: <AssignmentDesc
                            assignments={assignments}
                            listTitle={`Les meilleurs apprenants ${
                                    subjectValue !== 0 ? `en ${selectedSubject ?? name}` : ` de ${selectedClasse ?? name}`
                            }`}
                            setRefetch={handleConfirmation}
                            showBarChart={showBarChart}
                            barLayout={subjectValue ? 'horizontal' : 'vertical'}
                            hasLegend={hasLegend}
                            hasPermission={hasPermission}
                            studentAllScores={bestStudent}
                            isLoading={isLoading}
                            scoreLoading={loading}
                            showBest={showBest}
                            showOnlyBestTable={showOnlyBestTable}
                            onlyMark={studentId}
                            calendarLimit={calendarLimit}
                        />
                    },
                    ...(tabViews ? [...tabViews] : []),
                ]}
                onTabChange={changeTab}
            />
        </>
    )
}

export {AssignmentView}