import {useDocumentTitle} from "@/hooks/useDocumentTitle.ts";
import {text} from "@/core/utils/text_display.ts";
import {useEffect, useMemo, useState} from "react";
import ViewHeader from "../../components/ui/layout/ViewHeader.tsx";
import {useBreadCrumb} from "../../hooks/useBreadCrumb.tsx";
import Datetime from "../../core/datetime.ts";
import {ViewRoot} from "../../components/custom/ViewRoot.tsx";
import {AttendanceAnalysis} from "@/components/ui-kit-att";
import {SelectAcademicYear} from "../../components/common/SelectAcademicYear.tsx";
import {LuCalendarPlus} from "react-icons/lu";
import {redirectTo} from "@/context/RedirectContext.ts";
import {Dayjs} from "dayjs";
import {DatePicker} from "antd";
import {AcademicYear} from "@/entity";
import {datehelper} from "@/core/helpers/DateHelpers.ts";
import {Moment} from "@/core/utils/interfaces.ts";

const AttendancePage = () => {

    useDocumentTitle({
        title: text.att.label,
        description: "Exam description",
    })

    const {context} = useBreadCrumb({bCItems: [{ title: text.att.label }]})

    const [academicYear, setAcademicYear] = useState<string>('')
    const [academicYearResource, setAcademicYearResource] = useState<AcademicYear>()

    const dateReference = useMemo(() => datehelper.getDateReference(academicYearResource?.startDate as Moment, academicYearResource?.endDate as Moment), [academicYearResource])

    const [date, setDate] = useState<Datetime>(dateReference)
    
    useEffect(() => {
        if (date.isToday() && !date.isBetween(academicYearResource?.startDate as Moment, academicYearResource?.endDate as Moment)) {
            setDate(Datetime.of(dateReference))
        }
    }, [academicYearResource, date, dateReference])

    const getItems = [
        {icon: <LuCalendarPlus />, label: text.att.group.add.label, onClick: () => redirectTo(text.att.group.add.href)}
    ]

    const [startDate, endDate] = useMemo(() => [
        Datetime.of(academicYearResource?.startDate as number[]).toDayjs(),
        Datetime.of(academicYearResource?.endDate as number[]).toDayjs()
    ], [academicYearResource])

    return (
        <>
            {context}
            <ViewHeader
                isLoading={false}
                setEdit={() => redirectTo(text.att.group.edit.href)}
                editText={text.att.group.edit.label}
                items={getItems as []}
                closeState={false}
                btnLabel={"Gérer la fiche de présence"}
                blockProps={[
                    {title: 'Date du jour', mention: <mark>{date.fullDay()}</mark>},
                    {
                        title: 'Année Académique',
                        mention: <SelectAcademicYear
                            getAcademicYear={setAcademicYear as never}
                            defaultValue={true as never}
                            getResource={setAcademicYearResource as () => void}
                        />
                    },
                    {
                        title: 'Date Sélectionné',
                        mention: <DatePicker
                            value={dateReference?.toDayjs()}
                            format='DD/MM/YYYY'
                            onChange={(date: Dayjs) => setDate(Datetime.of(date))}
                            variant='borderless'
                            minDate={startDate}
                            maxDate={endDate}
                            placeholder='Selectionner la date'
                            disabledDate={(curent: Dayjs) => curent.day() === 0}
                        />
                    }
                ]}
                addMargin={{
                    position: 'top',
                    size: 20
                }}
                showBtn
            />
            <ViewRoot
                items={[
                    {
                        label: 'État de présence',
                        children: <AttendanceAnalysis date={date} academicYear={academicYear}/>
                    }
                ]}
                exists={academicYear !== null}
                memorizedTabKey={'attendance-analysis'}
            />
        </>
    )
}

export default AttendancePage