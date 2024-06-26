import {
    LuAtSign,
    LuBadgeCheck,
    LuBadgeDollarSign,
    LuBarChart3,
    LuClipboardCheck,
    LuCog,
    LuContact,
    LuLayoutDashboard,
    LuLibrary,
    LuUsers
} from "react-icons/lu";
import {MenuProps} from "antd";
import {PiNotebook, PiStudent} from "react-icons/pi";
import {FaUserTie} from "react-icons/fa";
import {text} from "../utils/text_display.ts";

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
        key: '/teachers',
        icon: <LuUsers />,
        label: "Enseignants"
    },
    {
        key: '/employees',
        icon: <FaUserTie />,
        label: "Employés"
    },
    {
        key: '/classes-and-subjects',
        icon: <PiNotebook />,
        label: "Classes et Matières"
    },
    {
        key: '/examinations',
        icon: <LuClipboardCheck />,
        label: "Examens"
    },
    {
        key: '/attendance',
        icon: <LuBadgeCheck />,
        label: "Présence"
    },
    {
        key: '/library',
        icon: <LuLibrary />,
        label: "Bibliothèque"
    },
    {
        key: '/fee-and-finance',
        icon: <LuBadgeDollarSign />,
        label: "Frais et Finance"
    },
    {
        key: '/communication',
        icon: <LuAtSign />,
        label: "Communication"
    },
    {
        key: '/staff-management',
        icon: <LuContact />,
        label: "Resource Humaine",
        title: 'Gestion du personnel'
    },
    {
        key: '/report-and-analytics',
        icon: <LuBarChart3 />,
        label: "Rapport/Analyses"
    },
    {
        key: '/settings',
        icon: <LuCog />,
        label: "Paramètres"
    },
]