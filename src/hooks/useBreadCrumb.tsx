import {FaHome} from "react-icons/fa";
import {ReactNode, useMemo} from "react";
import {text} from "../core/utils/text_display.ts";
import PageHierarchy from "../components/breadcrumb/PageHierarchy.tsx";

export type BreadcrumbType = {title: string | ReactNode, path?: string, state?: unknown}
export type BreadcrumbContextType = {item: BreadcrumbType[], context: ReactNode}
export type BCProps = {bCItems: BreadcrumbType[], mBottom?: number}

export const useBreadCrumb = ({mBottom, bCItems}: BCProps): BreadcrumbContextType => {
    const fullBreadcrumbs = useMemo(() => {
        return [
            {
                title: <FaHome size={20} />,
                path: text.home.href,
            },
            ...bCItems,
        ];
    }, [bCItems]);

    return {
        item: fullBreadcrumbs,
        context: <PageHierarchy items={fullBreadcrumbs} mBottom={mBottom} />
    };
}

export const useBreadcrumbItem = (item: BreadcrumbType[]): BreadcrumbType[] => {
    return useMemo(() => {
        return [
            ...item,
        ];
    }, [item]);

}