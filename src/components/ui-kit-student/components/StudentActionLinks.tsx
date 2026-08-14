import {ActionButtonsProps} from "@/core/utils/interfaces.ts";
import {ItemType} from "antd/es/menu/interface";
import {useMemo} from "react";
import {LuBan, LuCircleArrowOutUpRight, LuUserMinus, LuUserPlus} from "react-icons/lu";
import {useMenuItemsEffect} from "@/hooks/useMenuItemsEffect.ts";
import {Tooltip} from "antd";
import {Enrollment, Student} from "@/entity";
import {useToggle} from "@/hooks/useToggle.ts";
import {StudentPromotion} from "./StudentPromotion.tsx";
import {useRedirect} from "@/hooks/useRedirect.ts";
import {usePermission} from "@/hooks/usePermission.ts";
import {RemoveStudent} from "@/components/ui-kit-student";

export const StudentActionLinks = ({data, getItems, setRefresh}: ActionButtonsProps<Enrollment>) => {
    const [openPromoteStudent, setOpenPromoteStudent] = useToggle(false)
    const [openRemoveStudent, setOpenRemoveStudent] = useToggle(false)
    const [shouldReEnroll, setShouldReEnroll] = useToggle(false)
    const {toDiscipline} = useRedirect()
    const {canDelete, canCreate, can} = usePermission()
    
    const {enrollment, studentId} = useMemo(() => ({
        enrollment: data,
        studentId: data?.student?.id
    }), [data])
    
    const items: ItemType[] = useMemo(() => [
        ...(canCreate && !enrollment?.isArchived ? [{type: 'divider'}]: []),

        //TODO Do not show reinscription if the student have just been reinscrit.
        ...(canCreate ? [{
            key: `reinscription-${studentId}`,
            label: 'Réinscrire',
            icon: <LuUserPlus/>,
            onClick: () => {
                setShouldReEnroll()
                setOpenPromoteStudent()
            },
            disabled: !enrollment?.isArchived
        }] : []),

        ...(canCreate ? [{
            key: `promu-${studentId}`,
            label: <Tooltip title="Changer de classe">Promouvoir</Tooltip>,
            icon: <LuCircleArrowOutUpRight/>,
            onClick: setOpenPromoteStudent,
            disabled: enrollment?.isArchived
        }] : []),

        ...(can('reprimand') && !enrollment?.isArchived ? [{
            key: 'discipline-' + studentId,
            label: "Sanctions disciplinaires",
            icon: <LuBan />,
            onClick: () => toDiscipline(studentId as string, enrollment as Enrollment)
        }] : []),

        ...(canDelete ? [{type: 'divider'}]: []),

        ...(canDelete ? [{
            key: `delete-${studentId}`,
            label: 'Rétiré',
            icon: <LuUserMinus />,
            danger: true,
            disabled: enrollment?.isArchived,
            onClick: setOpenRemoveStudent
        }] : [])
    ] as [], [
        can, canCreate, canDelete, enrollment, setShouldReEnroll,
        setOpenPromoteStudent, setOpenRemoveStudent, studentId, toDiscipline
    ])
    
    useMenuItemsEffect(items, getItems)
    
    return(
        <section>
            {openPromoteStudent && <StudentPromotion
                student={data as Enrollment}
                open={openPromoteStudent}
                close={setOpenPromoteStudent}
                setRefresh={setRefresh}
                shouldReEnroll={shouldReEnroll}
            />}
            {canDelete && openRemoveStudent && <RemoveStudent
                data={data?.student as Student}
                open={openRemoveStudent}
                close={setOpenRemoveStudent}
                setRefresh={setRefresh}
            />}
        </section>
    )
}