import {DatePicker, Flex} from "antd";
import {SelectAcademicYear} from "./SelectAcademicYear.tsx";
import {Dayjs} from "dayjs";
import Datetime from "../../core/datetime.ts";
import {SelectClasse} from "./SelectClasse.tsx";
import {useEffect, useMemo, useState} from "react";
import {AcademicYear, Classe} from "../../entity";

interface AttendanceSelectsProps {
    setAcademicYear: (value: string) => void
    setClasseId: (value: number) => void
    getDate: (value: Datetime) => void
    onlyClasse?: number
    getClasse?: (value: Classe) => void
    onlyAcademicYear?: boolean
}

export const AttendanceSelects = (
    {setAcademicYear, setClasseId, getDate, onlyClasse, getClasse}: AttendanceSelectsProps
) => {
    const [academicYearResource, setAcademicYearResource] = useState<AcademicYear>()
    const [classeRessource, setClasseRessource] = useState<Classe>()
    const [date, setDate] = useState(Datetime.now())

    const [startDate, endDate] = useMemo(() => [
        Datetime.of(academicYearResource?.startDate as number[]).toDayjs(),
        Datetime.of(academicYearResource?.endDate as number[]).toDayjs()
    ], [academicYearResource])

    useEffect(() => {
        if (classeRessource) {
            getClasse && getClasse(classeRessource)
        }
        
        if (date) {
            getDate(date)
        }
    }, [classeRessource, date, getClasse, getDate]);
    
    return(
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
                    onlyCurrent={onlyClasse}
                    getResource={getClasse ? setClasseRessource as () => void : undefined}
                />
            </Flex>
        </div>
    )
}