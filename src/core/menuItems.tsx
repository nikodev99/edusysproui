import {
    LuAtSign,
    LuBadgeCheck,
    LuBadgeDollarSign, LuChartBar,
    LuClipboardCheck,
    LuCog,
    LuContact,
    LuLayoutDashboard,
    LuLibrary, LuScale, LuUniversity,
    LuUsers, LuUsersRound,
} from "react-icons/lu";
import {message} from "antd";
import {ItemType} from "antd/es/menu/interface";
import {PiNotebook, PiStudent} from "react-icons/pi";
import {NavConfig} from "./utils/text_display.ts";
import {routeAccess} from "../middleware/routeAccess.ts";
import {loggedUser} from "@/auth/jwt/LoggedUser.ts";
import {stringhelper} from "@/core/helpers/StringHelper.ts";

export const getMenuItemForUser = (text: NavConfig): ItemType[] => {
    const roles = loggedUser.getRole()
    const plural = (label: string) => stringhelper.setPlural(label, {allWords: true})

    if (!roles || roles.length === 0) {
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
            label: plural(text.home.label),
        },
        {
            key: text.student.href,
            icon: <PiStudent />,
            label: plural(text.student.label),
        },
        {
            key: text.guardian.href,
            icon: <LuUsersRound />,
            label: plural(text.guardian.label)
        },
        {
            key: text.teacher.href,
            icon: <LuUsers />,
            label: plural(text.teacher.label)
        },
        {
            key: text.cc.href,
            icon: <PiNotebook />,
            label: plural(text.cc.label)
        },
        {
            key: text.exam.href,
            icon: <LuClipboardCheck />,
            label: plural(text.exam.label)
        },
        {
            key: text.att.href,
            icon: <LuBadgeCheck />,
            label: plural(text.att.label)
        },
        {
            key: text.library.href,
            icon: <LuLibrary />,
            label: plural(text.library.label)
        },
        {
            key: text.finance.href,
            icon: <LuBadgeDollarSign />,
            label: plural(text.finance.label)
        },
        {
            key: text.chat.href,
            icon: <LuAtSign />,
            label: plural(text.chat.label),
        },
        {
            key: text.employee.href,
            icon: <LuContact />,
            label: plural(text.employee.label),
            title: 'Gestion du personnel'
        },
        {
            key: '/report-and-analytics',
            icon: <LuChartBar />,
            label: plural("Rapport/Analyses")
        },
        {
            key: text.org.href,
            icon: <LuUniversity />,
            label: plural(text.org.label),
            children: [
                {key: text.org.group.school.href, label: plural(text.org.group.school.label)},
                {key: text.org.group.academicYear.href, label: plural(text.org.group.academicYear.label)},
                {key: text.org.group.grade.href, label: plural(text.org.group.grade.label)},
                {key: text.org.group.department.href, label: plural(text.org.group.department.label)},
                {key: text.org.group.user.href, label: plural(text.org.group.user.label)}
            ]
        },
        {
            key: text.settings.href,
            icon: <LuCog />,
            label: plural(text.settings.label),
        },
        {
            key: text.legal.href,
            icon: <LuScale />,
            label: plural(text.legal.label),
            children: [
                {key: text.legal.group.certificates.href, label: plural(text.legal.group.certificates.label)},
                {key: text.legal.group.term.href, label: plural(text.legal.group.term.label)},
                {key: text.legal.group.document.href, label: plural(text.legal.group.document.label)},
            ]
        }
    ]

    return routeAccess.filterMenuItems(allMenuItems)
}