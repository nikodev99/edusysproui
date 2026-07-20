import {cloneElement, isValidElement, ReactNode, useEffect, useMemo, useState} from "react";
import {Assignment, Classe, Course, Score} from "@/entity";
import TabItem from "../view/TabItem.tsx";
import {SuperWord} from "../../core/utils/tsxUtils.tsx";
import {Select} from "antd";
import {AssignmentDesc} from "./AssignmentDesc.tsx";
import {UseQueryResult} from "@tanstack/react-query";
import {isString} from "@/core/utils/utils.ts";
import {Moment} from "@/core/utils/interfaces.ts";

interface AssignmentViewProps {
    assignExams: UseQueryResult<Assignment[], unknown>
    getSubject?: (id: number) => void
    classeId?: number
    getClasse?: (id: number) => void
    bestScores?: Score[]
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
    label?: string
    calendarLimit?: {
        startDate?: Moment
        endDate?: Moment
    }
}

const AssignmentView = (
    {
        assignExams, bestScores, tabViews, title, name, showBarChart, hasLegend, showBest = true, getSubject,
        getClasse, courses, classes, selects, studentId, disableSelect, label = 'Evaluation', calendarLimit
    }: AssignmentViewProps
) => {
    const [assignments, setAssignments] = useState<Assignment[] | null>(null)
    const [allSubjects, setAllSubjects] = useState<{value: number | undefined, label: string | undefined}[] | null>(null)
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
    
    const bestStudent = useMemo(() => bestScores && bestScores?.length > 0 ? bestScores : null, [bestScores])

    const disabledSelect = useMemo(() => 
            selectedTabKey === 'exam-list' || 
            (disableSelect && selectedTabKey === 'assignment-list'), 
        [disableSelect, selectedTabKey]
    )

    useEffect(() => {
        if (isSuccess) {
            setAssignments(data as Assignment[])
            setAllSubjects((prevSubjects) => {
                if (!courseExists) {
                    const seen = new Map<number | undefined, string | undefined>(prevSubjects?.map(s => [s.value, s.label]))
                    seen.set(0, "Tous");

                    (data as Assignment[])?.forEach(a => {
                        if (!seen.has(a?.subject?.id)) {
                            seen.set(a?.subject?.id, a?.subject?.course)
                        }
                    });

                    return Array.from(seen.entries()).map(([value, label]) => ({value, label}))
                }
                return prevSubjects
            })
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
                        key='select-subject'
                        className='select-control'
                        defaultValue={subjectValue}
                        options={(allSubjects ?? subjects) as []}
                        onChange={handleSubjectValue}
                        variant='borderless'
                        disabled={!disabledSelect ? !!(disableSelect && disabledSelect) : disabledSelect}
                    />)]: []),
                    ...(classes && classes?.length > 0 ? [(<Select
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
                            listTitle={<SuperWord
                                input={`Les meilleurs apprenants ${
                                    subjectValue !== 0 ? `en ${selectedSubject}` : ` de ${selectedClasse ?? name}`
                                }`}
                            />}
                            setRefetch={handleConfirmation}
                            showBarChart={showBarChart}
                            barLayout={subjectValue ? 'horizontal' : 'vertical'}
                            hasLegend={hasLegend}
                            studentAllScore={bestStudent}
                            isLoading={isLoading}
                            scoreLoading={loading}
                            showBest={showBest}
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