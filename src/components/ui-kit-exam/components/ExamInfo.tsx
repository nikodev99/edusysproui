import {InfoPageProps} from "../../../core/utils/interfaces.ts";
import {Assignment, Score, Teacher} from "../../../entity";
import Block from "../../view/Block.tsx";
import {InitMarkType, SuperWord} from "../../../core/utils/tsxUtils.tsx";
import {Widgets} from "../../ui/layout/Widgets.tsx";
import {text} from "../../../core/utils/text_display.ts";
import {useStudentRepo} from "../../../hooks/useStudentRepo.ts";
import {cutStatement, findPercent, sumInArray} from "../../../core/utils/utils.ts";
import PanelSection from "../../ui/layout/PanelSection.tsx";
import {Tag as AntTag, Tooltip} from "antd";
import PanelTable from "../../ui/layout/PanelTable.tsx";
import Datetime from "../../../core/datetime.ts";
import Tag from "../../ui/layout/Tag.tsx";
import {
    AssignmentType,
    AssignmentTypeLiteral,
    getAssignmentType,
    typeColors
} from "../../../entity/enums/assignmentType.ts";
import {useTeacherRepo} from "../../../hooks/useTeacherRepo.ts";
import {TeacherIndividual} from "../../common/TeacherIndividual.tsx";
import Section from "../../ui/layout/Section.tsx";
import {MarksHistogram} from "../../common/MarksHistogram.tsx";
import VoidData from "../../view/VoidData.tsx";
import {BestScoredTable} from "../../common/BestScoredTable.tsx";
import {useMemo} from "react";

type ExamInfoType = InfoPageProps<Assignment> & {
    marks?: Score[]
}

const ExamWidgets = ({infoData, color, marks}: ExamInfoType) => {
    const {useCountClasseStudents} = useStudentRepo()
    const {data: classeStudentCount} = useCountClasseStudents(
        infoData?.classe?.id as number,
        infoData?.semester?.semester?.academicYear?.id as string
    )

    const notes = marks?.filter(m => m.isPresent === true)?.map(m => m?.obtainedMark) ?? []
    const greatestNote = notes?.length > 0 ? Math.max(...notes) : 0
    const poorestNote = notes?.length > 0 ? Math.min(...notes) : 0
    const averageNote = notes?.length > 0 ? parseFloat((sumInArray(notes) / notes.length).toFixed(2)) : 0

    return(
        <section style={{marginBottom: '20px'}}>
            <Widgets hasShadow items={[
                {
                    title: `Nombre ${text.student.label} présent`,
                    value: notes?.length ?? 0,
                    progress: {
                        active: true,
                        percent: findPercent(notes?.length ?? 0, classeStudentCount?.total ?? 1) as number,
                        color: color,
                    }
                },
                {
                    title: 'Meilleur Note',
                    value: greatestNote ?? 0,
                    suffix: infoData?.passed || greatestNote ? <InitMarkType av={greatestNote} /> : undefined,
                    progress: {
                        active: true,
                        percent: findPercent(greatestNote, 20) as number,
                        color: color
                    }
                },
                {
                    title: 'Pire Note',
                    value: poorestNote ?? 0,
                    suffix: infoData?.passed || poorestNote ? <InitMarkType av={poorestNote} /> : undefined,
                    progress: {
                        active: true,
                        percent: findPercent(poorestNote, 20) as number,
                        color: color
                    }
                },
                {
                    title: 'Note Moyenne',
                    value: averageNote ?? 0,
                    suffix: infoData?.passed || averageNote ? <InitMarkType av={averageNote} /> : undefined,
                    progress: {
                        active: true,
                        percent: findPercent(averageNote, 20) as number,
                        color: color
                    }
                },
            ]} />
        </section>
    )
}

const ExamIndividual = ({infoData, color}: ExamInfoType) => {
    const type = AssignmentTypeLiteral[infoData?.type as unknown as keyof typeof AssignmentTypeLiteral]
    const assType = AssignmentType[infoData?.type as unknown as keyof typeof AssignmentType]

    return(
        <PanelSection title={
            <div className='name__title'>
                <h2 style={{fontSize: '20px', marginBottom: '5px'}}>
                    <Tooltip title={infoData?.examName || 'No Exam Name Available'} placement='top'>
                        <div><SuperWord input={cutStatement(`${infoData?.examName}`, 30) as string} /></div>
                    </Tooltip>
                </h2>
                <p className='subtitle'>Informations Générales</p>
            </div>
        }>
            <PanelTable title='Devoir info' panelColor={color} data={[
                {statement: 'Devoir', response: <SuperWord input={infoData.examName as string} />},
                {statement: 'Type', response:  <span>{getAssignmentType(assType)} <AntTag color={typeColors(type) as string}>{type}</AntTag></span>},
                {statement: 'Coefficient', response: <AntTag>{infoData?.coefficient ?? 1}</AntTag>},
                {statement: "Date d'ajout", response: Datetime.of(infoData?.addedDate as number).fDatetime()},
                {statement: "Dernière mise à jour", response: Datetime.of(infoData?.updatedDate as number).fDatetime()}
            ]} />
            <PanelTable title='Examen' panelColor={color} data={[
                {statement: 'Composition', response: infoData?.exam?.examType?.name},
                {statement: 'Début', response: Datetime.of(infoData?.exam?.startDate as number[]).fDate()},
                {statement: 'Fin', response: Datetime.of(infoData?.exam?.endDate as number[]).fDate()},
            ]} />
        </PanelSection>
    )
}

const ExamSemester = ({infoData, color}: ExamInfoType) => {
    const semester = useMemo(() => infoData?.semester?.semester, [infoData?.semester?.semester])

    return(
        <PanelSection title='Semestre'>
            <PanelTable title='Semestre' panelColor={color} data={[
                {statement: 'Semestre', response: semester?.template?.semesterName},
            ...(semester?.template?.description ? [{statement: 'Description', response: semester?.template?.description}] : []),
                {statement: 'Planning', response: infoData?.semester?.designation},
                {statement: 'Début', response: Datetime?.of(infoData?.semester?.termStartDate as number[]).fDate()},
                {statement: 'Fin', response: Datetime?.of(infoData?.semester?.termEndDate as number[]).fDate()}
            ]} />
            <PanelTable title='Année Scolaire' panelColor={color} data={[
                {statement: 'Année Scolaire', response: semester?.academicYear?.academicYear},
                {
                    statement: 'Status', response: semester?.academicYear?.current ?
                        <Tag color='success'>en cours</Tag> :
                        <Tag color='processing'>Inactif</Tag>
                },
                {statement: 'Début', response: Datetime.of(semester?.academicYear?.startDate as number[]).fDate()},
                {statement: 'Fin', response: Datetime.of(semester?.academicYear?.endDate as number[]).fDate()},
            ]} />
        </PanelSection>
    )
}

const ExamClasseSubject = ({infoData, color}: ExamInfoType) => {
    return(
        <PanelSection title='Classe & Matière'>
            <PanelTable title='Classe' panelColor={color} data={[
                {statement: 'Classe', response: <AntTag>{infoData?.classe?.name}</AntTag>},
                {statement: 'Category', response: infoData?.classe?.category},
                {statement: 'Grade', response: <AntTag>{infoData?.classe?.grade?.section}</AntTag>},
                ...(infoData?.classe?.roomNumber ? [{statement: 'N° de Salle', response: infoData?.classe?.roomNumber}] : [])
            ]} />
            <PanelTable title='Matière' panelColor={color} data={[
                {statement: 'Matière', response: infoData?.subject?.course},
                {statement: 'Abbreviation', response: infoData?.subject?.abbr},
                {statement: 'code', response: <AntTag>{infoData?.subject?.department?.code}</AntTag>},
            ]} />
        </PanelSection>
    )
}

const ExamTeacher = ({infoData, color}: ExamInfoType) => {
    const {useGetTeacherBasic} = useTeacherRepo()
    const teacher = useGetTeacherBasic(infoData?.preparedBy?.id as number, infoData?.classe?.id as number)

    return(
        <PanelSection title='Professeur Responsable'>
            <TeacherIndividual teacher={teacher as Teacher} color={color} />
        </PanelSection>
    )
}

const ExamMarkHistogram = ({color, marks}: ExamInfoType) => {
    return(
        <Section title='Histogramme des notes'>
            {marks && marks?.length > 0 ?
                (
                    <MarksHistogram
                        scores={marks as Score[]}
                        isLoading={false}
                        color={color as string}
                    />
                ):
                (
                    <VoidData title='Notes non disponible' />
                )
            }
        </Section>
    )
}

const ExamStudentPerformance = ({marks, color}: ExamInfoType) => {
    const sortedMarks = marks?.sort((a, b) => a.obtainedMark - b.obtainedMark)
    const poorMarks = sortedMarks?.slice(0, 3)
    const bestMarks = sortedMarks?.slice(-3)

    return(
        <PanelSection title='Performance individuelle'>
            {
                marks && marks?.length > 0 ? (<>
                    <PanelTable title='Trois meilleurs notes' data={[
                        {response: <BestScoredTable providedData={bestMarks} color={color} />, tableRow: true}
                    ]} panelColor={color} />
                    <PanelTable title='Trois pires notes' data={[{
                        response: <BestScoredTable providedData={poorMarks} color={color} goodToPoor={true} />,
                        tableRow: true
                    }]} panelColor={color} />
                </>): (
                    <VoidData title='Notes non disponible' />
                )
            }
        </PanelSection>
    )
}

export const ExamInfo = (examType: ExamInfoType) => {
    const {marks} = examType

    return (
        <>
            <ExamWidgets {...examType} marks={marks} />
            <Block items={[
                <ExamIndividual {...examType} />,
                <ExamSemester {...examType} />,
                <ExamClasseSubject {...examType} />,
                <ExamTeacher {...examType} />,
                <ExamMarkHistogram {...examType} marks={marks} />,
                <ExamStudentPerformance {...examType} marks={marks} />
            ]} />
        </>
    )
}