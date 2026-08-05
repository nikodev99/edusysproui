import {InsertModal} from "@/components/custom/InsertSchema.tsx";
import {StudentBossSchema, studentBossSchema} from "@/schema";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {saveStudentBoss} from "@/data/repository/classeRepository.ts";
import {useEffect, useState} from "react";
import Datetime, {DateFormat} from "@/core/datetime.ts";
import {useStudentRepo} from "@/hooks/actions/useStudentRepo.ts";
import {getClasseEnrolledStudentsSearch} from "@/data/repository/studentRepository.ts";
import {useSearch} from "@/hooks/useSearch.ts";
import {Select} from "antd";
import {ClasseBossesProps} from "@/entity/domain/classe.ts";

export const AddClasseStudentBoss = (
    {academicYear, classeId, open, onClose}: ClasseBossesProps
) => {
    const [searchValue, setSearchValue] = useState<string>()
    const {studentOptions} = useStudentRepo()
    const studentForm = useForm<StudentBossSchema>({
        resolver: zodResolver(studentBossSchema)
    })

    const {fetching, options, handleChange, handleSearch, resource} = useSearch({
        setValue: setSearchValue  as (value: unknown) => void,
        fetchFunc: getClasseEnrolledStudentsSearch as never,
        funcParams: [classeId, academicYear],
        setCustomOptions: studentOptions
    })

    const {reset} = studentForm

    useEffect(() => {
        reset({
            academicYear: {
                id: academicYear
            },
            classe: {
                id: classeId
            },
            current: true,
            startPeriod: Datetime.now().format(DateFormat.ISO_DATE),
            principalStudent: {id: resource?.student?.id}
        })
    }, [academicYear, classeId, reset, resource?.student?.id])

    return(
        <InsertModal
            open={open}
            onCancel={onClose}
            data={studentBossSchema as never}
            customForm={<div>
                <Select
                    placeholder={"Sélectionné le chef de classe"}
                    options={options}
                    onSearch={handleSearch}
                    notFoundContent={fetching ? 'Recherche...' : null}
                    onChange={handleChange}
                    showSearch
                    filterOption={false}
                    style={{width: "100%"}}
                    value={searchValue}
                />
            </div>}
            handleForm={studentForm}
            postFunc={saveStudentBoss as never}
            messageSuccess="Nouveau chef de classe ajouter avec success"
            title='Ajouter un nouveau chef classe'
            okText='Ajouter chef de classe'
            description="Souhaitez-vous poursuivre avec l'ajout du chef de classe ?"
            isNotif={true}
            toReset={false}
            width={400}
        />
    )
}