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
    LuUsers,
    LuUserPlus2
} from "react-icons/lu";
import {MenuProps} from "antd";
import {PiNotebook, PiStudent, PiUsersFour} from "react-icons/pi";
import {FaUserTie} from "react-icons/fa";

export const menuItems: Required<MenuProps>['items'][number][] = [
    {
        key: '/dashboard',
        icon: <LuLayoutDashboard />,
        label: 'Tableau de bord',
    },
    {
        key: '/student',
        icon: <PiStudent />,
        label: "Élèves",
        children: [
            {
                key: '/student/all',
                label: 'Apprenants',
                icon: <PiUsersFour />
            },
            {
                key: '/student/new',
                label: 'Inscription',
                icon: <LuUserPlus2 />
            },
            {
                key: '/student/renew',
                label: 'Re-Inscription'
            }
        ]
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