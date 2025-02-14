import {Enrollment, Score} from "../../../entity";
import {fDate, setFirstName, startsWithVowel} from "../../../utils/utils.ts";
import {Badge, Select, Table, TableColumnsType, Typography} from "antd";
import {ExamData} from "../../../utils/interfaces.ts";
import {fetchAllStudentScores, fetchAllStudentScoresBySubject} from "../../../data/action/scoreAction.ts";
import LocalStorageManager from "../../../core/LocalStorageManager.ts";
import {useEffect, useMemo, useState} from "react";
import {initExamData} from "../../../entity/domain/score.ts";
import PageError from "../../../pages/PageError.tsx";
import {LuEye} from "react-icons/lu";
import {Link} from "react-router-dom";
import TabItem from "../../view/TabItem.tsx";
import {useFetch} from "../../../hooks/useFetch.ts";
import {ColumnGroupType} from "antd/es/table";

interface StudentExamProps {
    enrolledStudent: Enrollment
}

export const StudentExam = ({enrolledStudent}: StudentExamProps) => {

    const examCount = LocalStorageManager.get<number>('examCount') ?? 0;

    const {academicYear: {id, academicYear}, student, student: {personalInfo, enrollments}} = enrolledStudent

    const [scores, setScores] = useState<Score[]>([])
    const [subjectValue, setSubjectValue] = useState<number>(0)
    const [academicYearId, setAcademicYearId] = useState<string>(id)

    const studentName = `${setFirstName(personalInfo?.lastName)} ${setFirstName(personalInfo?.firstName)}`

    const {data, error, isLoading, refetch} = useFetch(['student-scores', student?.id], fetchAllStudentScores, [examCount, 10, student.id, academicYearId])

    const subjects = useMemo(() => {
        return [
            {value: 0, label: 'Tous'},
            ...scores.filter(s => s?.assignment)
                .map(s => ({
                value: s.assignment?.subject?.id,
                label: s.assignment?.subject?.course,
            }))]
    }, [scores])

    const academicYears = useMemo(() => {
        return enrollments && [
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
            width: '30%',
            render: text => <Typography.Link>{text}</Typography.Link>
        },
        {
            title: "Classe",
            dataIndex: 'classe',
            key: 'classe',
            align: 'center',
            render: text => <Typography.Text mark>{text}</Typography.Text>
        },
        {
            title: "Date",
            dataIndex: 'examDate',
            key: 'examDate',
            align: 'center',
            render: text => fDate(text),
            responsive: ['md'],
        },
        {
            title: "Note",
            dataIndex: 'obtainedMark',
            key: 'obtainedMark',
            align: 'center',
            render: (text: number) => <Typography.Title level={4}>
                {text}
                <Badge color={text >= 15 ? 'green' : text >= 10 ? 'gold' : 'red' } />
            </Typography.Title>
        },
        {
            dataIndex: 'examId',
            key: 'examId',
            align: 'right',
            width: '50px',
            //TODO redirect to the exam link
            render: (examId) => <Link to={examId}><LuEye size={15} /></Link>
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
            title={`Les notes d${startsWithVowel(personalInfo?.lastName) ? "'" : 'e '}${studentName}`}
            selects={[
                subjects.length > 1 && <Select
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
                        columns={columns as ColumnGroupType[]}
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