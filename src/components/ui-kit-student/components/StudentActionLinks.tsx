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
    const {toDiscipline} = useRedirect()
    const {canDelete, canCreate, can} = usePermission()
    
    const {enrollment, studentId} = useMemo(() => ({
        enrollment: data,
        studentId: data?.student?.id
    }), [data])

    console.log({data, enrollment})
    
    const items: ItemType[] = useMemo(() => [
        {type: 'divider'},
        ...(canCreate ? [{
            key: `reinscription-${studentId}`,
            label: 'Réinscrire',
            icon: <LuUserPlus/>,
            disabled: enrollment?.academicYear?.current
        }] : []),
        ...(canCreate ? [{
            key: `promu-${studentId}`,
            label: <Tooltip title="Changer de classe">Promouvoir</Tooltip>,
            icon: <LuCircleArrowOutUpRight/>,
            onClick: setOpenPromoteStudent
        }] : []),
        ...(can('reprimand') ? [{
            key: 'discipline-' + studentId,
            label: "Sanctions disciplinaires",
            icon: <LuBan />,
            onClick: () => toDiscipline(studentId as string, enrollment as Enrollment)
        }] : []),
        {type: 'divider'},
        ...(canDelete ? [{
            key: `delete-${studentId}`,
            label: 'Rétiré',
            icon: <LuUserMinus />,
            danger: true,
            onClick: setOpenRemoveStudent
        }] : [])
    ], [can, canCreate, canDelete, enrollment, setOpenPromoteStudent, setOpenRemoveStudent, studentId, toDiscipline])
    
    useMenuItemsEffect(items, getItems)

    console.log('Open delete student pane: ', openRemoveStudent)
    
    return(
        <section>
            <StudentPromotion
                student={data as Enrollment}
                open={openPromoteStudent}
                close={setOpenPromoteStudent}
                setRefresh={setRefresh}
            />
            {canDelete && openRemoveStudent && <RemoveStudent
                data={data?.student as Student}
                open={openRemoveStudent}
                close={setOpenRemoveStudent}
                setRefresh={setRefresh}
            />}
        </section>
    )
}