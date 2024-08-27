import PageWrapper from "../ui/layout/PageWrapper.tsx";
import {Enrollment, Score} from "../../entity";
import {fDatetime, setFirstName, startsWithVowel} from "../../utils/utils.ts";
import {Select, Table, TableColumnsType, Tabs} from "antd";
import {ExamData} from "../../utils/interfaces.ts";
import {keepPreviousData, useQuery} from "@tanstack/react-query";
import {fetchAllStudentScores, fetchAllStudentScoresBySubject} from "../../data/action/fetch_score.ts";
import LocalStorageManager from "../../core/LocalStorageManager.ts";
import {useEffect, useState} from "react";
import {initExamData} from "../../entity/domain/score.ts";
import PageError from "../../pages/PageError.tsx";
import {LuEye} from "react-icons/lu";
import {Link} from "react-router-dom";

interface StudentExamProps {
    enrolledStudent: Enrollment
}

const StudentExam = ({enrolledStudent}: StudentExamProps) => {

    const examCount = LocalStorageManager.get<number>('examCount') ?? 0;

    const {academicYear: {id, academicYear}, student: {firstName, lastName, enrollments}} = enrolledStudent

    const [scores, setScores] = useState<Score[]>([])
    const [subjectValue, setSubjectValue] = useState<number>(0)
    const [academicYearId, setAcademicYearId] = useState<string>(id)

    const studentName = `${setFirstName(lastName)} ${setFirstName(firstName)}`

    const {data, error, isLoading, refetch} = useQuery({
        queryKey: ['student-scores'],
        queryFn: async () => await fetchAllStudentScores(examCount, 10, academicYearId).then(res => res.data),
        placeholderData: keepPreviousData
    })

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
            //TODO redirect to the exact link
            render: (examId) => <Link to={examId}>Voir</Link>
        }
    ];

    const subjects = [
        ...[{value: 0, label: 'Tous'}],
        scores.map(s => ({
            value: s.exam.subject?.id,
            label: s.exam.subject?.course,
        }))
    ]

    const academicYears = [
        ...[{value: id, label: academicYear}],
        enrollments.map(e => ({
            value: e.academicYear.id,
            label: e.academicYear.academicYear
        }))
    ]

    const handleAcademicYearIdValue = (value: string) => {
        setAcademicYearId(value)
    }

    const handleSubjectValue = (value: number) => {
        setSubjectValue(value)
    }

    console.log('SubjectId: ', subjectValue, 'academicYearId: ', academicYearId)

    return(
        <PageWrapper>
            <div className='exam-section-container'>
                <div className='full__name'>
                    <h1>Les notes d{startsWithVowel(lastName) ? "'" : 'e '}{studentName}</h1>
                </div>
                <div className="scores">
                    <div className="pl-scores">
                        <div className="head">
                            <div className="multi-head-select">
                                <div className="head-select">
                                    <Select
                                        className='select-control'
                                        defaultValue={0}
                                        options={subjects}
                                        onChange={handleSubjectValue}
                                    />
                                </div>
                                <div className="head-select">
                                    <Select
                                        className='select-control'
                                        defaultValue={id}
                                        options={academicYears}
                                        onChange={handleAcademicYearIdValue}
                                    />
                                </div>
                            </div>
                            <Tabs centered size='small' items={[
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
                            ]} />
                        </div>
                    </div>
                </div>
            </div>
        </PageWrapper>
    )
}

export default StudentExam