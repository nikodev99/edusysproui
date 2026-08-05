import {ActionButtonsProps} from "@/core/utils/interfaces.ts";
import {Classe} from "@/entity";
import {useMemo} from "react";
import {
    LuBookOpenCheck,
    LuBookPlus,
    LuCalendarCheck, LuCalendarPlus, LuTrash,
    LuUserCheck,
    LuUserPlus,
    LuUserRoundCheck,
    LuUserRoundPlus
} from "react-icons/lu";
import {useMenuItemsEffect} from "@/hooks/useMenuItemsEffect.ts";
import {ItemType} from "antd/es/menu/interface";
import {useToggle} from "@/hooks/useToggle.ts";
import {AddClassePrincipalCourse, AddClasseStudentBoss, AddClasseTeacherBoss} from "@/components/ui-kit-cc";
import {useRedirect} from "@/hooks/useRedirect.ts";

type ClasseActionButtons = ActionButtonsProps<Classe> & {
    academicYear?: string
    permissions?: { 
        canCreate: boolean, canDelete: boolean, isPrincipal: boolean
    }
}

export const ClasseActionLinks = ({data, getItems, setRefresh, academicYear, permissions}: ClasseActionButtons) => {
    const [addStudentBoss, setAddStudentBoss] = useToggle(false)
    const [addTeacherBoss, setAddTeacherBoss] = useToggle(false)
    const [addCourse, setAddCourse] = useToggle(false)
    const {toAddSchedule} = useRedirect()

    const {canCreate, canDelete, isPrincipal} = useMemo(() => permissions || {canCreate: false, canDelete: false, isPrincipal: false}, [permissions])

    const items: ItemType[] = useMemo(() =>[
        ...((canCreate || isPrincipal) ? [{
            key: `classroom-boss-${data?.id}`,
            label: data?.principalStudent ? 'Changer chef de classe' : 'Ajouter chef de classe',
            icon: data?.principalStudent ? <LuUserRoundCheck /> : <LuUserRoundPlus />,
            onClick: () => setAddStudentBoss()
        }] : []),
        ...(canCreate ? [{
            key: `classroom-teacher-boss-${data?.id}`,
            label: data?.principalTeacher ? 'Changer prof principal' : 'Ajouter prof principal',
            icon: data?.principalTeacher ? <LuUserCheck /> : <LuUserPlus />,
            onClick: setAddTeacherBoss
        }] : []),
        ...((canCreate || isPrincipal) ? [{
            key: `classroom-course-${data?.id}`,
            label: data?.principalCourse ? 'Changer matière principal' : 'Ajouter matière principal',
            icon: data?.principalCourse ? <LuBookOpenCheck /> : <LuBookPlus />,
            onClick: () => setAddCourse()
        }] : []),
        ...((canCreate || isPrincipal) ? [{
            key: `classroom-schedule-${data?.id}`,
            label: data?.schedule && data.schedule?.length > 0 ? "Changer l'emploi du temps" : "Ajouter l'emploi du temps",
            icon: data?.schedule && data.schedule?.length > 0 ? <LuCalendarCheck /> : <LuCalendarPlus />,
            onClick: () => toAddSchedule(data?.id as number)
        }]: []),
        ...(canDelete ? [{type: 'divider'}, {
            key: `delete-${data?.id}`,
            icon: <LuTrash />,
            label: 'Delete',
            danger: true
        }] : [])
    ] as ItemType[], [
        canCreate, canDelete, data?.id, data?.principalCourse, data?.principalStudent, data?.principalTeacher,
        data?.schedule, isPrincipal, setAddStudentBoss, setAddTeacherBoss, setAddCourse, toAddSchedule
    ])

    useMenuItemsEffect(items, getItems)

    const handleCloseAddStudentBoss = () => {
        setRefresh?.(true)
        setAddStudentBoss()
    }

    const handleCloseAddTeacherBoss = () => {
        setRefresh?.(true)
        setAddTeacherBoss()
    }

    const handleCloseAddCourse = () => {
        setRefresh?.(true)
        setAddCourse()
    }

    return(
        <section>
            {addStudentBoss && <AddClasseStudentBoss
                open={addStudentBoss}
                onClose={handleCloseAddStudentBoss}
                academicYear={academicYear as string}
                classeId={data?.id as number}
            />}
            {addTeacherBoss && <AddClasseTeacherBoss
                open={addTeacherBoss}
                onClose={handleCloseAddTeacherBoss}
                academicYear={academicYear as string}
                classeId={data?.id as number}
            />}
            {addCourse && <AddClassePrincipalCourse
                open={addCourse}
                onClose={handleCloseAddCourse}
                academicYear={academicYear as string}
                classeId={data?.id as number}
                classe={data}
            />}

        </section>
    )
}