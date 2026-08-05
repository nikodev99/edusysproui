import {InsertModal} from "@/components/custom/InsertSchema.tsx";
import {teacherBossSchema, TeacherBossSchema} from "@/schema";
import {Select} from "antd";
import {saveTeacherBoss} from "@/data/repository/classeRepository.ts";
import {ClasseBossesProps} from "@/entity/domain/classe.ts";
import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useSearch} from "@/hooks/useSearch.ts";
import Datetime, {DateFormat} from "@/core/datetime.ts";
import {useTeacherRepo} from "@/hooks/actions/useTeacherRepo.ts";

export const AddClasseTeacherBoss = ({academicYear, classeId, open, onClose}: ClasseBossesProps) => {
    const [searchValue, setSearchValue] = useState<string>()
    const {useGetPaginated, teacherOptions} = useTeacherRepo()
    const {getSearchedTeachers} = useGetPaginated()
    const teacherForm = useForm<TeacherBossSchema>({
        resolver: zodResolver(teacherBossSchema)
    })

    const {fetching, options, handleChange, handleSearch, resource} = useSearch({
        setValue: setSearchValue  as (value: unknown) => void,
        fetchFunc: getSearchedTeachers as never,
        setCustomOptions: teacherOptions
    })

    const {reset} = teacherForm

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
            principalTeacher: {id: resource?.id}
        })
    }, [academicYear, classeId, reset, resource?.id])

    return(
        <InsertModal
            open={open}
            onCancel={onClose}
            data={teacherBossSchema as never}
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
            handleForm={teacherForm}
            postFunc={saveTeacherBoss as never}
            messageSuccess="Nouveau responsable de la classe ajouter avec success"
            title='Ajoute Responsable'
            okText='Ajouter Responsable'
            description="Souhaitez-vous poursuivre avec l'ajout de ce responsable de classe ?"
            isNotif={true}
            toReset={false}
            width={400}
        />
    )
}