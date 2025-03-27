import {FaHome} from "react-icons/fa";
import {ReactNode, useMemo} from "react";
import {text} from "../core/utils/text_display.ts";

export type Breadcrumb = {title: string | ReactNode, path?: string}

export const useBreadCrumb = (items: Breadcrumb[]): Breadcrumb[] => {
    return useMemo(() => {
        return [
            {
                title: <FaHome size={20} />,
                path: text.home.href,
            },
            ...items,
        ];
    }, [items]);
}