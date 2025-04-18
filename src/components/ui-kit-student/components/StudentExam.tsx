import {Enrollment, Score} from "../../../entity";
import {fDate, setFirstName, startsWithVowel} from "../../../core/utils/utils.ts";
import {Badge, Select, TableColumnsType, Typography} from "antd";
import {ExamData, Pageable} from "../../../core/utils/interfaces.ts";
import LocalStorageManager from "../../../core/LocalStorageManager.ts";
import {useEffect, useMemo, useRef, useState} from "react";
import {initExamData} from "../../../entity/domain/score.ts";
import PageError from "../../../pages/PageError.tsx";
import {LuEye} from "react-icons/lu";
import {Link} from "react-router-dom";
import {ColumnGroupType} from "antd/es/table";
import {AutoScrollTable} from "../../ui/layout/AutoScrollTable.tsx";
import {AssignmentView} from "../../common/AssignmentView.tsx";
import {useAssignmentRepo} from "../../../hooks/useAssignmentRepo.ts";
import {useScoreRepo} from "../../../hooks/useScoreRepo.ts";

interface StudentExamProps {
    enrolledStudent: Enrollment
}

export const StudentExam = ({enrolledStudent}: StudentExamProps) => {

    const examCount = LocalStorageManager.get<number>('examCount') ?? 10;

    const {academicYear: {id, academicYear}, student, student: {personalInfo, enrollments}, classe} = enrolledStudent

    const [scores, setScores] = useState<Score[]>([])
    const [subjectValue, setSubjectValue] = useState<number>(0)
    const [allData, setAllData] = useState<number>(0)
    const [size, setSize] = useState(examCount)
    const [academicYearId, setAcademicYearId] = useState<string>(id)
    const pageable = useRef<Pageable | undefined>({size: size ?? examCount, page: 0});
    
    const {useGetAllClasseAssignments} = useAssignmentRepo()
    const {useGetAllStudentScores} = useScoreRepo()

    const studentName = `${setFirstName(personalInfo?.lastName)} ${setFirstName(personalInfo?.firstName)}`

    const assignments = useGetAllClasseAssignments(classe?.id, academicYearId)
    const {data, isSuccess, error, isLoading, isRefetching, refetch} = useGetAllStudentScores(student?.id, academicYearId, pageable.current, subjectValue)

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
        if (subjectValue)
            pageable.current = undefined
    }, [subjectValue]);
    
    useEffect(() => {
        if (academicYearId || size || subjectValue) {
            refetch().then(r => r.data)
        }
        if (isSuccess) {
            if (data && 'content' in data && 'totalElements' in data) {
                setScores(data.content as Score[])
                setAllData(data.totalElements as number)
            }else {
                setScores(data as Score[])
            }
        }
    }, [academicYearId, data, isSuccess, refetch, size, subjectValue]);
    
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
            title: "Matière",
            dataIndex: 'subject',
            key: 'subjet',
            align: 'left',
            width: '20%',
            render: text => <Typography.Text>{text}</Typography.Text>
        },
        {
            title: "Classe",
            dataIndex: 'classe',
            key: 'classe',
            align: 'center',
            width: '10%',
            render: text => <Typography.Text mark>{text}</Typography.Text>
        },
        {
            title: "Date",
            dataIndex: 'examDate',
            key: 'examDate',
            align: 'center',
            responsive: ['md'],
            width: '15%',
            render: text => fDate(text),
        },
        {
            title: "Coefficient",
            dataIndex: 'coefficient',
            key: 'coefficient',
            align: 'center',
            width: '10%',
            render: (text: number) => <Typography.Text>
                {text}
            </Typography.Text>
        },
        {
            title: "Note",
            dataIndex: 'obtainedMark',
            key: 'obtainedMark',
            align: 'center',
            width: '10%',
            render: (text: number) => <Typography.Title level={4}>
                {text}
                <Badge color={text >= 15 ? 'green' : text >= 10 ? 'gold' : 'red' } />
            </Typography.Title>
        },
        {
            dataIndex: 'examId',
            key: 'examId',
            align: 'right',
            width: '5px',
            //TODO redirect to the exam link
            render: (examId) => <Link to={examId}><LuEye size={15} /></Link>
        }
    ];

    const handleLoadMoreSize = () => {
        setSize(prevState => prevState + examCount)
    }

    const handleAcademicYearIdValue = (value: string) => {
        setAcademicYearId(value)
    }

    return(
        <AssignmentView
            assignExams={assignments}
            title={`Les notes d${startsWithVowel(personalInfo?.lastName) ? "'" : 'e '}${studentName}`}
            selects={[
                <Select
                    className='select-control'
                    defaultValue={academicYearId}
                    options={academicYears}
                    onChange={handleAcademicYearIdValue}
                    variant='borderless'

                />
            ]}
            academicYear={academicYearId}
            tabViews={[
                {
                    key: 'score-table',
                    label: 'Performance aux devoirs',
                    children: <AutoScrollTable
                        tableProps={{
                            columns: columns as ColumnGroupType[],
                            dataSource: initExamData(scores),
                            size: 'small',
                            pagination: false,
                            className: 'score-table',
                            loading: isLoading,
                            rowKey: item => item?.examId,
                            bordered: true
                        }}
                        isLoading={isLoading || isRefetching}
                        allItems={allData}
                        size={size}
                        loadMoreSize={handleLoadMoreSize}
                        height={500}
                    />
                }
            ]}
            getSubject={setSubjectValue}
            showBest={false}
            studentId={student?.id}
            disableSelect
        />
    )
}