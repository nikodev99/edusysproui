import {FaHome} from "react-icons/fa";
import {BreadcrumbItems} from "../utils/interfaces.ts";

export const setBreadcrumb = (items: BreadcrumbItems[]) => {
    return [{
        title: (
            <FaHome size={20} />
        ),
        path: '/dashboard'
    }, ...items]
}