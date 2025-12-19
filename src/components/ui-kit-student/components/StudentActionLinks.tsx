import {ActionButtonsProps} from "@/core/utils/interfaces.ts";
import {ItemType} from "antd/es/menu/interface";
import {useMemo} from "react";
import {LuBan, LuCircleArrowOutUpRight, LuUserMinus, LuUserPlus} from "react-icons/lu";
import {useMenuItemsEffect} from "@/hooks/useMenuItemsEffect.ts";
import {Tooltip} from "antd";
import {Enrollment} from "@/entity";
import {useToggle} from "@/hooks/useToggle.ts";
import {StudentPromotion} from "./StudentPromotion.tsx";
import {isEnroll, isTeacher, isTopAdmin} from "@/auth/dto/role.ts";
import {useRedirect} from "@/hooks/useRedirect.ts";

export const StudentActionLinks = ({data, getItems, setRefresh}: ActionButtonsProps<Enrollment>) => {
    const [openPromoteStudent, setOpenPromoteStudent] = useToggle(false)
    const {toDiscipline} = useRedirect()
    
    const {enrollment, studentId} = useMemo(() => ({
        enrollment: data,
        studentId: data?.student?.id
    }), [data])

    console.log({data, enrollment})
    
    const items: ItemType[] = useMemo(() => [
        {type: 'divider'},
        ...(isTopAdmin() || isEnroll() ? [{
            key: `reinscription-${studentId}`,
            label: 'Réinscrire',
            icon: <LuUserPlus/>,
            disabled: enrollment?.academicYear?.current
        }] : []),
        ...(isTopAdmin() || isEnroll() ? [{
            key: `promu-${studentId}`,
            label: <Tooltip title="Changer de classe">Promouvoir</Tooltip>,
            icon: <LuCircleArrowOutUpRight/>,
            onClick: setOpenPromoteStudent
        }] : []),
        ...(isTopAdmin() || isTeacher() ? [{
            key: 'discipline-' + studentId,
            label: "Sanctions disciplinaires",
            icon: <LuBan />,
            onClick: () => toDiscipline(studentId as string, enrollment as Enrollment)
        }] : []),
        {type: 'divider'},
        ...(isTopAdmin() ? [{
            key: `delete-${studentId}`,
            label: 'Rétiré',
            icon: <LuUserMinus />,
            danger: true,
            onClick: () => alert("Archive the student")
        }] : [])
    ], [enrollment, setOpenPromoteStudent, studentId, toDiscipline])
    
    useMenuItemsEffect(items, getItems)
    
    return(
        <section>
            <StudentPromotion
                student={data as Enrollment}
                open={openPromoteStudent}
                close={setOpenPromoteStudent}
                setRefresh={setRefresh}
            />
        </section>
    )
}