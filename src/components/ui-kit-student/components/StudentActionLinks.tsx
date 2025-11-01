import {ActionButtonsProps, StudentListDataType} from "../../../core/utils/interfaces.ts";
import {ItemType} from "antd/es/menu/interface";
import {useMemo} from "react";
import {LuBan, LuCircleArrowOutUpRight, LuUserMinus, LuUserPlus} from "react-icons/lu";
import {useMenuItemsEffect} from "../../../hooks/useMenuItemsEffect.ts";
import {Tooltip} from "antd";
import {Enrollment} from "../../../entity";

export const StudentActionLinks = ({data, getItems}: ActionButtonsProps<StudentListDataType | Enrollment>) => {
    
    const enrollment = useMemo(() => data, [data])
    
    const studentId = useMemo(() => (data && 'student' in data) ? data?.student?.id : data?.id, [data])
    
    const items: ItemType[] = useMemo(() => [
        {type: 'divider'},
        {
            key: `reinscription-${studentId}`,
            label: 'Réinscrire',
            icon: <LuUserPlus/>,
            disabled: !enrollment?.academicYear?.current
        },
        {
            key: `promu-${studentId}`,
            label: <Tooltip title="Changer de classe">Promouvoir</Tooltip>,
            icon: <LuCircleArrowOutUpRight/>,
            onClick: () => alert("Promotion")
        },
        {
            key: 'discipline-' + studentId,
            label: "sanctions disciplinaires",
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
    ], [enrollment?.academicYear, studentId]) 
    
    useMenuItemsEffect(items, getItems)
    
    return(
        <section>

        </section>
    )
}