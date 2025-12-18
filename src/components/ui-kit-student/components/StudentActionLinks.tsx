import {ActionButtonsProps, StudentListDataType} from "@/core/utils/interfaces.ts";
import {ItemType} from "antd/es/menu/interface";
import {useMemo} from "react";
import {LuBan, LuCircleArrowOutUpRight, LuUserMinus, LuUserPlus} from "react-icons/lu";
import {useMenuItemsEffect} from "@/hooks/useMenuItemsEffect.ts";
import {Tooltip} from "antd";
import {Enrollment} from "@/entity";
import {useToggle} from "@/hooks/useToggle.ts";
import {StudentPromotion} from "./StudentPromotion.tsx";

export const StudentActionLinks = ({data, getItems, setRefresh}: ActionButtonsProps<StudentListDataType | Enrollment>) => {
    const [openPromoteStudent, setOpenPromoteStudent] = useToggle(false)
    
    const enrollment = useMemo(() => data, [data])
    
    const studentId = useMemo(() => (data && 'student' in data) ? data?.student?.id : data?.id, [data])
    
    const items: ItemType[] = useMemo(() => [
        {type: 'divider'},
        {
            key: `reinscription-${studentId}`,
            label: 'Réinscrire',
            icon: <LuUserPlus/>,
            disabled: enrollment?.academicYear?.current
        },
        {
            key: `promu-${studentId}`,
            label: <Tooltip title="Changer de classe">Promouvoir</Tooltip>,
            icon: <LuCircleArrowOutUpRight/>,
            onClick: setOpenPromoteStudent
        },
        {
            key: 'discipline-' + studentId,
            label: "Sanctions disciplinaires",
            icon: <LuBan />,
            onClick: () => alert('Sanctionné')
        },
        {type: 'divider'},
        {
            key: `delete-${studentId}`,
            label: 'Rétiré',
            icon: <LuUserMinus />,
            danger: true,
            onClick: () => alert("Archive the student")
        }
    ], [enrollment?.academicYear, setOpenPromoteStudent, studentId]) 
    
    useMenuItemsEffect(items, getItems)
    
    return(
        <section>
            <StudentPromotion student={data as Enrollment} open={openPromoteStudent} close={setOpenPromoteStudent} setRefresh={setRefresh} />
        </section>
    )
}