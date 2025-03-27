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
        icon: <LuChartBar />,
        label: "Rapport/Analyses"
    },
    {
        key: '/settings',
        icon: <LuCog />,
        label: "Paramètres",
        children: [
            {key: '/settings/organization', label: "Organization"},
            {key: '/settings/customization', label: "Customiser"},
            {key: '/settings/product_management', label: "Management des produits"},
            {key: '/settings/security', label: "Sécurité"},
            {key: '/settings/tags', label: "Tags"},
            {key: '/settings/legal_certificate', label: "Certificat Légal"},
            {key: '/settings/general_term', label: "Terme Général"},
            {key: '/settings/special_document', label: "Document Spéciale & Contrat"}
        ]
    },
]