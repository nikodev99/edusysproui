import {
    AtSign,
    BadgeCheck,
    BadgeDollarSign,
    BarChart3,
    ClipboardCheck,
    Cog,
    Contact,
    LayoutDashboard,
    Library,
    Notebook, Users,
    UserPlus2
} from "lucide-react";
import {MenuProps} from "antd";
import {FaUserGraduate, FaUserTie} from "react-icons/fa";

export const menuItems: Required<MenuProps>['items'][number][] = [
    {
        key: '/dashboard',
        icon: <LayoutDashboard />,
        label: 'Tableau de bord',
    },
    {
        key: '/students',
        icon: <FaUserGraduate size={24} />,
        label: "Élèves",
        children: [
            {
                key: '/students/new',
                label: 'Inscription',
                icon: <UserPlus2 />
            },
            {
                key: '/students/renew',
                label: 'Re-Inscription'
            }
        ]
    },
    {
        key: '/teachers',
        icon: <Users />,
        label: "Enseignants"
    },
    {
        key: '/employees',
        icon: <FaUserTie size={25} />,
        label: "Employés"
    },
    {
        key: '/classes-and-subjects',
        icon: <Notebook />,
        label: "Classes et Matières"
    },
    {
        key: '/examinations',
        icon: <ClipboardCheck />,
        label: "Examens"
    },
    {
        key: '/attendance',
        icon: <BadgeCheck />,
        label: "Présence"
    },
    {
        key: '/library',
        icon: <Library />,
        label: "Bibliothèque"
    },
    {
        key: '/fee-and-finance',
        icon: <BadgeDollarSign />,
        label: "Frais et Finance"
    },
    {
        key: '/communication',
        icon: <AtSign />,
        label: "Communication"
    },
    {
        key: '/staff-management',
        icon: <Contact />,
        label: "Resource Humaine",
        title: 'Gestion du personnel'
    },
    {
        key: '/report-and-analytics',
        icon: <BarChart3 />,
        label: "Rapport/Analyses"
    },
    {
        key: '/settings',
        icon: <Cog />,
        label: "Paramètres"
    },
]