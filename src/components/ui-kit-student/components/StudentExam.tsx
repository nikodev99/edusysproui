import {Enrollment, Score} from "../../../entity";
import {fDatetime, setFirstName, startsWithVowel} from "../../../utils/utils.ts";
import {Select, Table, TableColumnsType} from "antd";
import {ExamData} from "../../../utils/interfaces.ts";
import {fetchAllStudentScores, fetchAllStudentScoresBySubject} from "../../../data/action/fetch_score.ts";
import LocalStorageManager from "../../../core/LocalStorageManager.ts";
import {useEffect, useMemo, useState} from "react";
import {initExamData} from "../../../entity/domain/score.ts";
import PageError from "../../../pages/PageError.tsx";
import {LuEye} from "react-icons/lu";
import {Link} from "react-router-dom";
import TabItem from "../../view/TabItem.tsx";
import {useFetch} from "../../../hooks/useFetch.ts";

interface StudentExamProps {
    enrolledStudent: Enrollment
}

export const StudentExam = ({enrolledStudent}: StudentExamProps) => {

    const examCount = LocalStorageManager.get<number>('examCount') ?? 0;

    const {academicYear: {id, academicYear}, student, student: {firstName, lastName, enrollments}} = enrolledStudent

    const [scores, setScores] = useState<Score[]>([])
    const [subjectValue, setSubjectValue] = useState<number>(0)
    const [academicYearId, setAcademicYearId] = useState<string>(id)

    const studentName = `${setFirstName(lastName)} ${setFirstName(firstName)}`

    const {data, error, isLoading, refetch} = useFetch('student-scores', fetchAllStudentScores, [examCount, 10, student.id, academicYearId])

    const subjects = useMemo(() => {
        return [
            {value: 0, label: 'Tous'},
            ...scores.map(s => ({
                value: s.exam.subject?.id,
                label: s.exam.subject?.course,
            }))]
    }, [scores])

    const academicYears = useMemo(() => {
        return [
            { value: id, label: academicYear},
            ...enrollments.map(e => ({
                value: e.academicYear.id,
                label: e.academicYear.academicYear
            }))
        ];
    }, [id, academicYear, enrollments]);
    
    useEffect(() => {
        if (subjectValue != 0) {
            fetchAllStudentScoresBySubject(academicYearId, subjectValue)
                .then((resp) => {
                    if (resp && resp.isSuccess && 'data' in resp) {
                        setScores(resp.data as Score[])
                    }
                })
        }else {
            refetch().then(r => r.data)
            if (academicYearId || examCount) {
                refetch().then(r => r.data)
            }
            if (!isLoading && data && 'content' in data) {
                setScores(data.content as Score[])
            }
        }
    }, [academicYearId, data, examCount, isLoading, refetch, subjectValue]);

    if (error) {
        return <PageError />
    }

    const columns: TableColumnsType<ExamData> = [
        {
            title: "Examen",
            dataIndex: 'examName',
            key: 'ExamName',
            align: 'left',
            width: '20%',
        },
        {
            title: "Classe",
            dataIndex: 'classe',
            key: 'classe',
            align: 'center'
        },
        {
            title: "Date",
            dataIndex: 'examDate',
            key: 'examDate',
            align: 'center',
            render: (text) => (<span>{fDatetime(text)}</span>),
            responsive: ['md'],
        },
        {
            title: "Note",
            dataIndex: 'obtainedMark',
            key: 'obtainedMark',
            align: 'center'
        },
        {
            title: (<LuEye size={15} />),
            dataIndex: 'examId',
            key: 'examId',
            align: 'right',
            width: '50px',
            //TODO redirect to the exam link
            render: (examId) => <Link to={examId}>Voir</Link>
        }
    ];

    const handleAcademicYearIdValue = (value: string) => {
        setAcademicYearId(value)
    }

    const handleSubjectValue = (value: number) => {
        setSubjectValue(value)
    }

    return(
        <TabItem
            title={`Les notes d${startsWithVowel(lastName) ? "'" : 'e '}${studentName}`}
            selects={[
                <Select
                    className='select-control'
                    defaultValue={0}
                    options={subjects}
                    onChange={handleSubjectValue}
                    variant='borderless'
                />,
                <Select
                    className='select-control'
                    defaultValue={id}
                    options={academicYears}
                    onChange={handleAcademicYearIdValue}
                    variant='borderless'
                />
            ]}
            items={[
                {
                    key: 'score-table',
                    label: 'Performance aux examens',
                    children: <Table
                        columns={columns}
                        dataSource={initExamData(scores)}
                        size='small'
                        pagination={false}
                        className='score-table'
                        loading={isLoading}
                        scroll={{y: 500}}
                    />}
            ]}
        />
    )
}