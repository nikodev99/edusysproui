import {ReactNode, useEffect, useMemo, useState} from "react";
import {Assignment, Classe, Course, Score} from "../../entity";
import TabItem from "../view/TabItem.tsx";
import {SuperWord} from "../../core/utils/tsxUtils.tsx";
import {Select} from "antd";
import {AssignmentDesc} from "./AssignmentDesc.tsx";
import {UseQueryResult} from "@tanstack/react-query";
import {isString} from "../../core/utils/utils.ts";

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
}

const AssignmentView = (
    {
        assignExams, academicYear, bestScores, tabViews, title, name, showBarChart, hasLegend, showBest = true, getSubject,
        classeId, getClasse, courses, classes, selects, studentId, disableSelect
    }: AssignmentViewProps
) => {
    const [assignments, setAssignments] = useState<Assignment[] | null>(null)
    const [allSubjects, setAllSubjects] = useState<{value: number | undefined, label: string | undefined}[] | null>(null)
    const [subjectValue, setSubjectValue] = useState<number>(courses && courses?.length > 0 ? courses[0].id as number : 0)
    const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
    const [selectedClasse, setSelectedClasse] = useState<string | null>(null)
    const [selectedTabKey, setSelectedTabKey] = useState<string | undefined>('assignment-list')
    const [classeValue, setClasseValue] = useState<number>(classes && classes?.length > 0 ? classes[0].id as number : 0)
    const [bestStudent, setBestStudent] = useState<Score[] | null>()
    const [loading] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(true);
    const [toRefetch, setToRefetch] = useState<boolean>(false)
    const [disabledSelect, setDisabledSelect] = useState<boolean>(false)

    const courseExists: boolean = courses && courses?.length > 0 || false

    const {data, isSuccess, refetch, isFetching, isRefetching, isFetched, isLoading: isFetchLoading, isPending} = assignExams

    const subjects = useMemo(() => {
        return courseExists ? courses?.map(c => ({
            value: c.id, label: c.course
        })) : []
    }, [courseExists, courses])

    const classrooms = useMemo(() => {
        return classes?.map(c => ({
            value: c.id, label: c.name
        }))
    }, [classes])

    useEffect(() => {
        if(classeId || classeValue || academicYear || subjectValue || toRefetch) {
            refetch()
                .then(r => {
                    if (toRefetch) {
                        setToRefetch(false)
                    }
                    return r.data
                })
        }

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

    }, [academicYear, classeId, classeValue, courses, courseExists, data, isSuccess, refetch, subjectValue, toRefetch]);

    useEffect(() => {
        if(isFetching || isRefetching || isFetchLoading || isPending) {
            setIsLoading(true)
        }else {
            setIsLoading(false)
        }
    }, [isFetchLoading, isFetched, isFetching, isPending, isRefetching]);

    useEffect(() => {
        if (bestScores)
            setBestStudent(bestScores)

        if (getSubject && subjectValue) {
            getSubject(subjectValue ?? 0)
        }

        if (getClasse && classeValue) {
            getClasse(classeValue)
        }

    }, [bestScores, classeValue, getClasse, getSubject, subjectValue]);

    useEffect(() => {
        if (disableSelect && selectedTabKey === 'assignment-list') {
            setDisabledSelect(true)
        }else {
            setDisabledSelect(false)
        }
    }, [disableSelect, selectedTabKey]);

    const handleSubjectValue = (value: number) => {
        setSubjectValue(prev => prev === value ? prev : value)
        setSelectedSubject(value !== 0 ? allSubjects?.find(s => s.value === value)?.label ?? null : null)
    }
    
    const handleClasseValue = (value: number) => {
        setClasseValue(prev => prev === value ? prev : value)
        setSelectedClasse(value !== 0 ? classes?.find(c => c.id === value)?.name ?? null : null)
    }

    const handleConfirmation = (value: boolean) => {
        setToRefetch(value);
    };

    const changeTab = (activeKey: string) => {
        setSelectedTabKey(activeKey)
        if (activeKey === 'exam-list')
            setDisabledSelect(true)
        else
            setDisabledSelect(false)
    }

    return (
        <>
            <TabItem
                title={isString(title) ? <SuperWord input={title} /> : title}
                selects={[
                    ...((allSubjects && allSubjects?.length > 0) || (subjects && subjects?.length > 0) ? [(<Select
                        className='select-control'
                        defaultValue={subjectValue}
                        options={allSubjects ?? subjects}
                        onChange={handleSubjectValue}
                        variant='borderless'
                        disabled={!disabledSelect ? !!(disableSelect && disabledSelect) : disabledSelect}
                    />)]: []),
                    ...(classes && classes?.length ? [(<Select
                        className='select-control'
                        defaultValue={classeValue}
                        options={classrooms}
                        onChange={handleClasseValue}
                        variant='borderless'
                    />)]: []),
                    ...(selects && selects?.length ? [...selects] : [])
                    //TODO Adding the filtre by semester
                ]}
                stickTab={true}
                items={[
                    {
                        key: 'assignment-list',
                        label: 'Evaluations',
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