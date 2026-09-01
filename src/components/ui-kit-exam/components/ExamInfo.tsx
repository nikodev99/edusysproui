import {InfoPageProps} from "@/core/utils/interfaces.ts";
import {Assignment, Course, Score, Teacher} from "@/entity";
import Block from "@/components/view/Block.tsx";
import {InitMarkType, SuperWord} from "@/core/utils/tsxUtils.tsx";
import {Widgets} from "@/components/ui/layout/Widgets.tsx";
import {text} from "@/core/utils/text_display.ts";
import {useStudentRepo} from "@/hooks/actions/useStudentRepo.ts";
import {cutStatement, findPercent, sumInArray} from "@/core/utils/utils.ts";
import PanelSection from "@/components/ui/layout/PanelSection.tsx";
import {Progress, Tag as AntTag, Tooltip} from "antd";
import PanelTable from "@/components/ui/layout/PanelTable.tsx";
import Datetime from "@/core/datetime.ts";
import Tag from "@/components/ui/layout/Tag.tsx";
import {AssignmentType, AssignmentTypeLiteral, getAssignmentType, typeColors} from "@/entity/enums/assignmentType.ts";
import {useTeacherRepo} from "@/hooks/actions/useTeacherRepo.ts";
import {TeacherIndividual} from "@/components/common/TeacherIndividual.tsx";
import Section from "@/components/ui/layout/Section.tsx";
import {MarksHistogram} from "@/components/common/MarksHistogram.tsx";
import VoidData from "@/components/view/VoidData.tsx";
import {BestScoredTable} from "@/components/common/BestScoredTable.tsx";
import {useCallback, useMemo} from "react";
import PanelStat from "@/components/ui/layout/PanelStat.tsx";
import {objectHelper} from "@/core/helpers/ObjectHelper.ts";

type ExamInfoType = InfoPageProps<Assignment> & {
    marks?: Score[]
    getNotes?: (onlyPresents?: boolean) => number[]
    maxScale?: number
}

const ExamWidgets = ({infoData, color, maxScale, getNotes}: ExamInfoType) => {
    const {useCountClasseStudents} = useStudentRepo()
    const {data: classeStudentCount} = useCountClasseStudents(
        infoData?.classe?.id as number,
        infoData?.semester?.academicYear?.id as string
    )

    const findAverage = (marks?: number[]) => {
        return marks && marks.length > 0 ? parseFloat((sumInArray(marks) / marks.length).toFixed(2)) : 0
    }
    
    const presentNotes = useMemo(() => getNotes?.(true), [getNotes])
    const notes = useMemo(() => getNotes?.(), [getNotes])

    const greatestNote = notes && notes?.length > 0 ? Math.max(...notes) : 0
    const poorestNote = presentNotes && presentNotes?.length > 0 ? Math.min(...presentNotes) : 0
    const averageNote = findAverage(notes)
    console.log({notes})

    return(
        <section style={{marginBottom: '20px'}}>
            <Widgets hasShadow items={[
                {
                    title: `Nombre ${text.student.label} présent`,
                    value: presentNotes?.length ?? 0,
                    progress: {
                        active: true,
                        percent: findPercent(presentNotes?.length ?? 0, classeStudentCount?.total ?? 1) as number,
                        color: color,
                    }
                },
                {
                    title: 'Meilleur Note',
                    value: greatestNote ?? 0,
                    suffix: infoData?.passed || greatestNote ? <InitMarkType av={greatestNote} maxScale={maxScale ?? 20} /> : undefined,
                    progress: {
                        active: true,
                        percent: findPercent(greatestNote, maxScale as number) as number,
                        color: color
                    }
                },
                {
                    title: 'Pire Note Présent',
                    value: poorestNote ?? 0,
                    suffix: infoData?.passed || poorestNote ? <InitMarkType av={poorestNote} maxScale={maxScale ?? 20} /> : undefined,
                    progress: {
                        active: true,
                        percent: findPercent(poorestNote, maxScale as number) as number,
                        color: color
                    }
                },
                {
                    title: 'Note Moyenne',
                    value: averageNote ?? 0,
                    suffix: infoData?.passed || averageNote ? <InitMarkType av={averageNote} maxScale={maxScale ?? 20} /> : undefined,
                    progress: {
                        active: true,
                        percent: findPercent(averageNote, maxScale as number) as number,
                        color: color
                    }
                },
            ]} />
        </section>
    )
}

const ExamIndividual = ({infoData, color, getNotes, maxScale}: ExamInfoType) => {
    const type = AssignmentTypeLiteral[infoData?.type as unknown as keyof typeof AssignmentTypeLiteral]
    const assType = AssignmentType[infoData?.type as unknown as keyof typeof AssignmentType]

    const notes = getNotes?.()

    /**
     * C'est la note qui coupe la classe en deux. La moitié des élèves a une note en dessous (ou égale) et l'autre moitié a une note au-dessus (ou égale).
     * 4 élèves ont eu moins de 12 (3, 8, 10, 10) et 4 élèves ont eu plus de 12 (14, 15, 18, 18). Ta classe est parfaitement coupée en deux sur cette note.
     */
    const medianMark = useMemo(() => {
        if(notes && notes?.length > 0) {
            const sortedNotes = notes.sort((a, b) => a - b)
            const mid = Math.floor(sortedNotes.length / 2)
            if(sortedNotes.length % 2 === 0) {
                return (sortedNotes[mid - 1] + sortedNotes[mid]) / 2
            }
            return sortedNotes[mid]
        }
        return 0
    }, [notes])

    /**
     * C'est la distance moyenne entre chaque note et la moyenne générale (qui est de 12). Il te dit, en gros, "en moyenne,
     * un élève s'éloigne de combien de points par rapport à la note de la classe".
     *
     * Un écart type de 4,9 est grand (sur 20), ce qui confirme que ta classe est très hétérogène : il y a de très faibles notes (3, 8) et de très bonnes (18, 18).
     */
    const standardDeviation = useMemo(() => {
        if(notes && notes?.length > 0) {
            const mean = notes.reduce((acc, curr) => acc + curr, 0) / notes.length
            return Math.sqrt(notes.map(n => Math.pow(n - mean, 2))
                .reduce((acc, curr) => acc + curr, 0) / notes.length)
        }
        return 0
    }, [notes])

    /**
     * En français facile : C'est l'étalement des notes du "gros paquet" du milieu. On enlève les 25% les plus mauvais
     * et les 25% les meilleurs, et on regarde l'écart entre ceux qui restent. Ça montre si la majorité des élèves sont regroupés ou très dispersés.
     *
     * L'écart entre eux est de 7,5 points. Ça veut dire que même dans le cœur de la classe, les niveaux sont assez différents (certains sont vers 9, d'autres vers 16).
     */
    const iqr = useMemo(() => {
        if(notes && notes?.length > 0) {
            const sorted = [...notes].sort((a, b) => a - b);

            const getMedian = (arr: number[]): number => {
                const mid = Math.floor(arr.length / 2);
                return arr.length % 2 === 0 ? (arr[mid - 1] + arr[mid]) / 2 : arr[mid];
            };

            const mid = Math.floor(sorted.length / 2);
            const lowerHalf = sorted.slice(0, mid);
            const upperHalf = sorted.length % 2 === 0
                ? sorted.slice(mid)
                : sorted.slice(mid + 1);

            const q1 = getMedian(lowerHalf);
            const q3 = getMedian(upperHalf);
            return q3 - q1;
        }
        return 0
    }, [notes])

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
            {notes && notes?.length > 0 && (
                <div className='panel'>
                    <PanelStat
                        title={medianMark.toFixed(2)}
                        subTitle='Note'
                        desc="Mediane"
                        round={<Progress percent={findPercent(medianMark, maxScale as number) as number} type='circle' size={35} strokeColor={color} />}
                    />
                    <PanelStat
                        title={standardDeviation.toFixed(2)}
                        subTitle='Ecart'
                        desc="Standard"
                        round={<Progress percent={findPercent(standardDeviation, (maxScale as number / 2)) as number} type='circle' size={35} strokeColor={color} />}
                    />
                    <PanelStat
                        title={iqr.toFixed(2)}
                        subTitle='Ecart'
                        desc="Interquartile"
                        round={<Progress percent={findPercent(iqr, maxScale as number) as number} type='circle' size={35} strokeColor={color} />}
                    />
                </div>
            )}
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
    const semester = useMemo(() => infoData?.semester, [infoData?.semester])

    return(
        <PanelSection title='Semestre'>
            <PanelTable title='Semestre' panelColor={color} data={[
                {statement: 'Semestre', response: semester?.template?.semesterName},
            ...(semester?.template?.description ? [{statement: 'Description', response: semester?.template?.description}] : []),
                {statement: 'Début', response: Datetime?.of(infoData?.semester?.startDate as number[]).fDate()},
                {statement: 'Fin', response: Datetime?.of(infoData?.semester?.endDate as number[]).fDate()}
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
            {!objectHelper.isEmpty(infoData?.subject as Course) && <PanelTable title='Matière' panelColor={color} data={[
                {statement: 'Matière', response: infoData?.subject?.course},
                {statement: 'Abbreviation', response: infoData?.subject?.abbr},
                {statement: 'code', response: <AntTag>{infoData?.subject?.department?.code}</AntTag>},
            ]} />}
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

const ExamMarkHistogram = ({color, marks, maxScale}: ExamInfoType) => {
    console.log({maxScale})

    return(
        <Section title='Histogramme des notes'>
            {marks && marks?.length > 0 ?
                (
                    <MarksHistogram
                        scores={marks as Score[]}
                        isLoading={false}
                        maxScale={maxScale as number}
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

    const maxScale = examType?.infoData?.classe?.grade?.gradingScaleMax

    const getNotes = useCallback((onlyPresents?: boolean) => {
        const markArray = onlyPresents ? marks?.filter(m => m.isPresent) : marks
        return markArray?.map(m => m.obtainedMark) ?? []
    }, [marks])

    return (
        <>
            <ExamWidgets {...examType} marks={marks} getNotes={getNotes} maxScale={maxScale} />
            <Block items={[
                <ExamIndividual {...examType} getNotes={getNotes} maxScale={maxScale} />,
                <ExamSemester {...examType} />,
                <ExamClasseSubject {...examType} />,
                <ExamTeacher {...examType} />,
                <ExamMarkHistogram {...examType} marks={marks} maxScale={maxScale} />,
                <ExamStudentPerformance {...examType} marks={marks} />
            ]} />
        </>
    )
}