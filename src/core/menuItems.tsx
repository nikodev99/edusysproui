import {
    LuAtSign,
    LuBadgeCheck,
    LuBadgeDollarSign, LuChartBar,
    LuClipboardCheck,
    LuCog,
    LuContact,
    LuLayoutDashboard,
    LuLibrary,
    LuUsers, LuUsersRound,
} from "react-icons/lu";
import {MenuProps} from "antd";
import {PiNotebook, PiStudent} from "react-icons/pi";
import {text} from "./utils/text_display.ts";

export const menuItems: Required<MenuProps>['items'][number][] = [
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
        key: text.settings.href,
        icon: <LuCog />,
        label: text.settings.label,
        children: [
            {key: text.settings.group.org.href, label: text.settings.group.org.label},
            {key: text.settings.group.customize.href, label: text.settings.group.customize.label},
            {key: text.settings.group.academicYear.href, label: text.settings.group.academicYear.label},
            {key: text.settings.group.grade.href, label: text.settings.group.grade.label},
            {key: text.settings.group.department.href, label: text.settings.group.department.label},
            {key: text.settings.group.user.href, label: text.settings.group.user.label},
            {key: '/settings/legal_certificate', label: "Certificat Légal"},
            {key: '/settings/general_term', label: "Terme Général"},
            {key: '/settings/special_document', label: "Document Spéciale & Contrat"}
        ]
    },
]