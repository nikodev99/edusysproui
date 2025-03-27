import {IDS, InfoPageProps} from "../../../core/utils/interfaces.ts";
import {Classe, Score, Assignment} from "../../../entity";
import {useEffect, useState} from "react";
import {
    getAllClasseAssignments,
    getAllClasseAssignmentsBySubject
} from "../../../data/repository/assignmentRepository.ts";
import {useFetch, useRawFetch} from "../../../hooks/useFetch.ts";
import {SuperWord} from "../../../core/utils/tsxUtils.tsx";
import {Select} from "antd";
import TabItem from "../../view/TabItem.tsx";
import {AssignmentDesc} from "../../common/AssignmentDesc.tsx";
import {getClasseBestStudents, getClasseBestStudentsByCourse} from "../../../data/repository/scoreRepository.ts";
import {ClasseExamView} from "./ClasseExamView.tsx";

export const ClasseExams = ({infoData, academicYear}: InfoPageProps<Classe>) => {
    const {id} = infoData

    const [assignments, setAssignments] = useState<Assignment[] | null>(null)
    const [allSubjects, setAllSubjects] = useState<{value: number | undefined, label: string | undefined}[] | null>(null)
    const [subjectValue, setSubjectValue] = useState<number | null>(0)
    const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
    const [bestStudent, setBestStudent] = useState<Score[] | null>()
    const [loading, setLoading] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(true);
    const [toRefetch, setToRefetch] = useState<boolean>(false)
    const [disabledSelect, setDisabledSelect] = useState<boolean>(false)
    const fetch = useRawFetch<Score>();

    const subjectFilter = subjectValue !== 0 ? getAllClasseAssignmentsBySubject : getAllClasseAssignments
    const bestStudentFilter = subjectValue !== 0 ? getClasseBestStudentsByCourse : getClasseBestStudents

    const {data, isSuccess, refetch, isFetching, isRefetching, isFetched, isLoading: isFetchLoading, isPending} = useFetch<Assignment, unknown>(['classe-assignments', id], subjectFilter, [{
        classeId: id, subjectId: subjectValue,
    }, academicYear])

    useEffect(() => {
        if(id || academicYear || subjectValue || toRefetch) {
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
            setAllSubjects(prevSubjects => {
                const seen = new Map<number | undefined, string | undefined>(prevSubjects?.map(s => [s.value, s.label]))
                seen.set(0, "Tous");

                (data as Assignment[])?.forEach(a => {
                    if (!seen.has(a?.subject?.id)) {
                        seen.set(a?.subject?.id, a?.subject?.course)
                    }
                });

                return Array.from(seen.entries()).map(([value, label]) => ({ value, label }))
            })
        }
        
    }, [academicYear, data, id, isSuccess, refetch, subjectValue, toRefetch]);

    useEffect(() => {
        if(isFetching || isRefetching || isFetchLoading || isPending) {
            setIsLoading(true)
        }else {
            setIsLoading(false)
        }
    }, [isFetchLoading, isFetched, isFetching, isPending, isRefetching]);

    useEffect(() => {
        fetch(bestStudentFilter, [{classId: infoData?.id, courseId: subjectValue} as IDS, academicYear])
            .then(resp => {
                setLoading(resp.isLoading as boolean)
                if (resp.isSuccess) {
                    setBestStudent(resp.data as Score[])
                }
            })
    }, [academicYear, bestStudentFilter, fetch, infoData?.id, subjectValue]);

    const handleSubjectValue = (value: number) => {
        setSubjectValue(prev => prev === value ? prev : value)
        setSelectedSubject(value !== 0 ? allSubjects?.find(s => s.value === value)?.label ?? null : null)
    }

    const handleConfirmation = (value: boolean) => {
        setToRefetch(value);
    };

    const changeTab = (activeKey: string) => {
        if (activeKey === 'exam-list')
            setDisabledSelect(true)
    }

    return (
        <>
            <TabItem
                title={<SuperWord input={`Devoirs de ${infoData.name}`} />}
                selects={[
                    assignments && assignments?.length > 0 && allSubjects && allSubjects?.length > 0 && (<Select
                        className='select-control'
                        defaultValue={subjectValue}
                        options={allSubjects}
                        onChange={handleSubjectValue}
                        variant='borderless'
                        disabled={disabledSelect}
                    />)
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
                                    subjectValue !== 0 ? `en ${selectedSubject}` : ` de ${infoData?.name}`
                                }`}
                            />}
                            setRefetch={handleConfirmation}
                            showBarChart={true}
                            barLayout={subjectValue ? 'horizontal' : 'vertical'}
                            hasLegend={false}
                            studentAllScore={bestStudent}
                            isLoading={isLoading}
                            scoreLoading={loading}
                        />
                    },
                    {
                        key: 'exam-list',
                        label: 'Examens',
                        children: <ClasseExamView
                            classeId={infoData?.id}
                            academicYear={academicYear || '0'}
                        />
                    }
                ]}
                onTabChange={changeTab}
            />
        </>
    )
}