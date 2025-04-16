import {InfoPageProps} from "../../../core/utils/interfaces.ts";
import {Score, Teacher, Assignment} from "../../../entity";
import TabItem from "../../view/TabItem.tsx";
import {Select} from "antd";
import {useEffect, useMemo, useState} from "react";
import {getAllTeacherAssignments, getAllTeacherCourseAssignments} from "../../../data/request";
import {useFetch} from "../../../hooks/useFetch.ts";
import {getBestStudentByScore, getBestStudentBySubjectScore} from "../../../data/repository/scoreRepository.ts";
import {AssignmentDesc} from "../../common/AssignmentDesc.tsx";
import {AxiosResponse} from "axios";

export const TeacherAssignments = ({infoData}: InfoPageProps<Teacher>) => {
    const {personalInfo, courses, classes} = infoData

    const [assignments, setAssignments] = useState<Assignment[] | null>(null)
    const [subjectValue, setSubjectValue] = useState<number | null>(courses && courses?.length > 0 ? courses[0].id as number : null)
    const [classeValue, setClasseValue] = useState<number>(classes && classes?.length > 0 ? classes[0].id as number : 0)
    const [studentAllScore, setStudentAllScore] = useState<Score[] | null>(null)
    const [shouldRefetch, setShouldRefetch] = useState<boolean>(false)
    const courseExists: boolean = courses && courses?.length > 0 || false

    const dataFetchFnc = courseExists ? getAllTeacherCourseAssignments : getAllTeacherAssignments
    const bestScoreFnc = courseExists ? getBestStudentBySubjectScore : getBestStudentByScore

    const {data, isSuccess, refetch} = useFetch<Assignment, unknown>(
        'assignment-list',
        dataFetchFnc as (...args: unknown[]) => Promise<AxiosResponse<Assignment, unknown>>,
        [personalInfo.id, {
            classId: classeValue,
            courseId: subjectValue
        }]
    )

    const {data: scoreData, isSuccess: scoreFetched, isLoading: scoreLoading} = useFetch<Score[], unknown>(
        'student-score',
        bestScoreFnc as (...args: unknown[]) => Promise<AxiosResponse<Score[], unknown>>,
        [personalInfo?.id, subjectValue], assignments !== null && assignments.length > 0
    )

    const subjects = useMemo(() => {
        return courses?.map(c => ({
            value: c.id, label: c.course
        }))
    }, [courses])

    const classrooms = useMemo(() => {
        return classes?.map(c => ({
            value: c.id, label: c.name
        }))
    }, [classes])

    useEffect(() => {
        if(subjectValue || classeValue || shouldRefetch) {
            refetch().then(r => {
                setShouldRefetch(false)
                return r.data
            })
        }
        if (isSuccess) {
            setAssignments(data as Assignment[])
        }
        if (scoreFetched) {
            setStudentAllScore(scoreData as Score[])
        }
    }, [classeValue, data, isSuccess, refetch, scoreData, scoreFetched, shouldRefetch, subjectValue]);

    const handleClasseValue = (value: number) => {
        setClasseValue(prev => prev === value ? prev : value)
    }

    const handleSubjectValue = (value: number) => {
        setSubjectValue(prev => prev === value ? prev : value)
    }

    return (
        <>
        <TabItem
            title={`Devoirs preparé par ${personalInfo?.lastName}`}
            selects={[
                courses && courses?.length > 0 && (<Select
                    className='select-control'
                    defaultValue={subjectValue}
                    options={subjects}
                    onChange={handleSubjectValue}
                    variant='borderless'
                />),
                <Select
                    className='select-control'
                    defaultValue={classeValue}
                    options={classrooms}
                    onChange={handleClasseValue}
                    variant='borderless'
                />
                //TODO Adding the filtre by semester
            ]}
            items={[
                {
                    key: 'assignment-list',
                    label: 'Liste de devoirs',
                    children: <AssignmentDesc
                        assignments={assignments}
                        listTitle={`Les meilleurs élèves de ${personalInfo?.lastName}`}
                        studentAllScore={studentAllScore}
                        scoreLoading={scoreLoading}
                        setRefetch={setShouldRefetch}
                        refetch={shouldRefetch}
                    />
                }
            ]}
        />
        </>
    )
}