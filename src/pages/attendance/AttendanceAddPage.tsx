import {useDocumentTitle} from "../../hooks/useDocumentTitle.ts";
import {ReactNode, useMemo, useState} from "react";
import PageHierarchy from "../../components/breadcrumb/PageHierarchy.tsx";
import {useBreadCrumb} from "../../hooks/useBreadCrumb.tsx";
import {text} from "../../core/utils/text_display.ts";
import {DatePicker, Flex} from "antd";
import {SelectAcademicYear} from "../../components/common/SelectAcademicYear.tsx";
import {SelectClasse} from "../../components/common/SelectClasse.tsx";
import Datetime from "../../core/datetime.ts";
import {Dayjs} from "dayjs";
import {AcademicYear} from "../../entity";
import {AttendanceInserting} from "../../components/ui-kit-att";

const AttendanceAddPage = () => {

    useDocumentTitle({
        title: "Mise à jour de présence",
        description: "AttendanceAddPage description",
    })

    const items = useBreadCrumb([
        {title: text.att.label, path: text.att.href},
        {title: text.att.group.add.label}
    ])

    const [academicYear, setAcademicYear] = useState<string>('')
    const [academicYearResource, setAcademicYearResource] = useState<AcademicYear>()
    const [classeId, setClasseId] = useState<number>(0)
    const [date, setDate] = useState<Datetime>(Datetime.now())

    const [startDate, endDate] = useMemo(() => [
        Datetime.of(academicYearResource?.startDate as number[]).toDayjs(),
        Datetime.of(academicYearResource?.endDate as number[]).toDayjs()
    ], [academicYearResource])

    return (
        <main>
            <PageHierarchy items={items as [{ title: string | ReactNode, path?: string }]}/>
            <div className="step-wrapper">
                <Flex align='center' gap={20}>
                    <SelectAcademicYear
                        getAcademicYear={setAcademicYear as () => void}
                        variant='filled'
                        placeholder='Année Academique'
                        onlyCurrent
                        getResource={setAcademicYearResource as () => void}
                    />
                    <DatePicker
                        value={date?.toDayjs()}
                        format='DD/MM/YYYY'
                        onChange={(date: Dayjs) => setDate(Datetime.of(date))}
                        variant='filled'
                        minDate={startDate}
                        maxDate={endDate}
                        placeholder='Selectionner la date'
                        disabledDate={(curent: Dayjs) => curent.day() === 0}
                    />
                    <SelectClasse
                        getClasse={setClasseId as () => void}
                        variant='filled'
                        placeholder='Selectionner la classe'
                    />
                </Flex>
            </div>
            <AttendanceInserting
                academicYear={academicYear}
                classeId={classeId}
                date={date}
            />
        </main>
    )
}

export default AttendanceAddPage;