import {FaHome} from "react-icons/fa";
import {ReactNode} from "react";
import {text} from "../utils/text_display.ts";

export type Breadcrumb = {title: string | ReactNode, path?: string}

export const setBreadcrumb = (items: Breadcrumb[]): Breadcrumb[] => {
    return [
        {
            title: (
                <FaHome size={20} />
            ),
            path: text.home.href
        },
        ...items
    ]
}