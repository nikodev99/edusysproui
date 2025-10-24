import {
    LuAtSign,
    LuBadgeCheck,
    LuBadgeDollarSign, LuChartBar,
    LuClipboardCheck,
    LuCog,
    LuContact,
    LuLayoutDashboard,
    LuLibrary, LuUniversity,
    LuUsers, LuUsersRound,
} from "react-icons/lu";
import {message} from "antd";
import {ItemType} from "antd/es/menu/interface";
import {PiNotebook, PiStudent} from "react-icons/pi";
import {text} from "./utils/text_display.ts";
import {loggedUser} from "../auth/jwt/LoggedUser.ts";
import {routeAccess} from "../middleware/routeAccess.ts";

export const getMenuItemForUser = (): ItemType[] => {
    const user = loggedUser.getUser()
    const roles = user?.roles ?? []

    if (!user || roles.length === 0) {
        message.warning("No user or no roles found").then()

        return [
            {
                key: text.home.href,
                icon: <LuLayoutDashboard />,
                label: text.home.label,
            },
        ]
    }

    const allMenuItems: ItemType[] = [
        {
            key: text.home.href,
            icon: <LuLayoutDashboard />,
            label: text.home.label,
        },
        {
            key: text.student.href,
            icon: <PiStudent />,
            label: text.student.label,
        },
        {
            key: text.guardian.href,
            icon: <LuUsersRound />,
            label: text.guardian.label
        },
        {
            key: text.teacher.href,
            icon: <LuUsers />,
            label: text.teacher.label + 's'
        },
        {
            key: text.cc.href,
            icon: <PiNotebook />,
            label: text.cc.label
        },
        {
            key: text.exam.href,
            icon: <LuClipboardCheck />,
            label: text.exam.label
        },
        {
            key: text.att.href,
            icon: <LuBadgeCheck />,
            label: text.att.label
        },
        {
            key: text.library.href,
            icon: <LuLibrary />,
            label: text.library.label
        },
        {
            key: text.finance.href,
            icon: <LuBadgeDollarSign />,
            label: text.finance.label
        },
        {
            key: text.chat.href,
            icon: <LuAtSign />,
            label: text.chat.label,
        },
        {
            key: text.employee.href,
            icon: <LuContact />,
            label: text.employee.label,
            title: 'Gestion du personnel'
        },
        {
            key: '/report-and-analytics',
            icon: <LuChartBar />,
            label: "Rapport/Analyses"
        },
        {
            key: text.org.href,
            icon: <LuUniversity />,
            label: text.org.label,
            children: [
                {key: text.org.group.school.href, label: text.org.group.school.label},
                {key: text.org.group.academicYear.href, label: text.org.group.academicYear.label},
                {key: text.org.group.grade.href, label: text.org.group.grade.label},
                {key: text.org.group.department.href, label: text.org.group.department.label},
                {key: text.org.group.user.href, label: text.org.group.user.label}
            ]
        },
        {
            key: text.settings.href,
            icon: <LuCog />,
            label: text.settings.label,
            children: [
                {key: text.settings.group.customize.href, label: text.settings.group.customize.label},
                {key: '/settings/legal_certificate', label: "Certificat Légal"},
                {key: '/settings/general_term', label: "Terme Général"},
                {key: '/settings/special_document', label: "Document Spéciale & Contrat"}
            ]
        },
    ]

    return routeAccess.filterMenuItems(allMenuItems, roles)
}