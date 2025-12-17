import {Enrollment, Score} from "../../../entity";
import {fDate, setFirstName, startsWithVowel} from "../../../core/utils/utils.ts";
import {Badge, Select, TableColumnsType, Tag, Typography} from "antd";
import {ExamData} from "../../../core/utils/interfaces.ts";
import LocalStorageManager from "../../../core/LocalStorageManager.ts";
import {useEffect, useMemo, useState} from "react";
import {initExamData} from "../../../entity/domain/score.ts";
import PageError from "../../../pages/errors/PageError.tsx";
import {ColumnGroupType} from "antd/es/table";
import {AutoScrollTable} from "../../ui/layout/AutoScrollTable.tsx";
import {AssignmentView} from "../../common/AssignmentView.tsx";
import {useAssignmentRepo} from "../../../hooks/actions/useAssignmentRepo.ts";
import {useScoreRepo} from "../../../hooks/actions/useScoreRepo.ts";
import {InitMarkType} from "../../../core/utils/tsxUtils.tsx";

interface StudentExamProps {
    enrolledStudent: Enrollment
}

export const StudentExam = ({enrolledStudent}: StudentExamProps) => {

    const examCount = LocalStorageManager.get<number>('examCount') ?? 10;

    const {academicYear, student, personalInfo, enrollments, classe} = useMemo(() => ({
        academicYear: enrolledStudent?.academicYear,
        student: enrolledStudent?.student,
        personalInfo: enrolledStudent?.student?.personalInfo,
        enrollments: enrolledStudent?.student?.enrollments,
        classe: enrolledStudent?.classe,
    }), [enrolledStudent?.academicYear, enrolledStudent?.classe, enrolledStudent?.student])

    const [scores, setScores] = useState<Score[]>([])
    const [subjectValue, setSubjectValue] = useState<number>(0)
    const [allData, setAllData] = useState<number>(0)
    const [size, setSize] = useState<number>(examCount)
    const [academicYearId, setAcademicYearId] = useState<string>(academicYear?.id ?? '')

    const {useGetAllClasseAssignments} = useAssignmentRepo()
    const {useGetAllStudentScores} = useScoreRepo()

    const studentName = `${setFirstName(personalInfo?.lastName)} ${setFirstName(personalInfo?.firstName)}`

    const assignments = useGetAllClasseAssignments(classe?.id, academicYearId)
    const {data, isSuccess, error, isLoading, isRefetching, refetch} = useGetAllStudentScores(student?.id, academicYearId, {size: size, page: 0}, subjectValue)

    console.log("VIEWED STUDENT: ", enrolledStudent)

    const academicYears = useMemo(() => {
        return enrollments && [
            { value: academicYear?.id, label: academicYear?.academicYear},
            ...enrollments?.map(e => ({
                value: e?.academicYear?.id,
                label: e?.academicYear?.academicYear
            })) ?? []
        ];
    }, [academicYear, enrollments]);

    useEffect(() => {
        if (subjectValue === 0) {
            setSize(examCount ?? 10)
        }else {
            setSize(0)
        }
    }, [examCount, subjectValue]);
    
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
            align: 'center',
            width: '18%',
            render: text => <Tag>{text}</Tag>
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
            align: 'right',
            responsive: ['md'],
            width: '13%',
            render: text => fDate(text),
        },
        {
            title: "Coefficient",
            dataIndex: 'coefficient',
            key: 'coefficient',
            align: 'center',
            width: '10%',
            render: (text: number) => <Tag>{text}</Tag>
        },
        {
            //TODO Adding the criteria sort
            title: "Note",
            dataIndex: 'obtainedMark',
            key: 'obtainedMark',
            align: 'end',
            width: '10%',
            //sorter: true,
            //showSorterTooltip: false,
            render: (text: number, record) => <Typography.Title level={4}>
                {text * (record?.coefficient ?? 1)}
                <Badge color={
                    text * (record?.coefficient ?? 1) >= 15 * (record?.coefficient ?? 1)
                        ? 'green'
                        : text * (record?.coefficient ?? 1) >= 10 * (record?.coefficient ?? 1)
                            ? 'gold'
                            : 'red' } />
            </Typography.Title>
        },
        {
            title: "Appreciation",
            dataIndex: 'obtainedMark',
            key: 'appreciation',
            align: 'center',
            width: '10%',
            render: (note: number, record) => <InitMarkType av={note} coefficient={record?.coefficient} />
        },
    ];

    const handleLoadMoreSize = () => {
        setSize(prevState => (prevState + examCount) || 10)
    }

    const handleAcademicYearIdValue = (value: string) => {
        setAcademicYearId(value)
    }

    return(
        <AssignmentView
            assignExams={assignments}
            title={`Les notes d${startsWithVowel(personalInfo?.lastName) ? "'" : 'e '}${studentName}`}
            label='Programmes des devoirs'
            selects={[
                <Select
                    className='select-control'
                    defaultValue={academicYearId}
                    options={academicYears}
                    onChange={handleAcademicYearIdValue}
                    variant='borderless'

                />
            ]}
            calendarLimit={{
                startDate: academicYear?.startDate,
                endDate: academicYear?.endDate
            }}
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
                        size={size ?? 0}
                        loadMoreSize={handleLoadMoreSize}
                        height={500}
                    />
                },
                {
                    key: 'exam-table',
                    label: 'Performance aux examens',
                    children: <div>ICI nous ajouterons les résultats aux examens</div>
                }
            ]}
            getSubject={setSubjectValue}
            showBest={false}
            studentId={student?.id}
            disableSelect
        />
    )
}