import {ReactNode} from "react";
import {Button, Flex} from "antd";
import {ItemType} from "antd/es/menu/interface";
import {ActionButton} from "../ui/layout/ActionButton.tsx";
import {BreadcrumbType, useBreadCrumb} from "../../hooks/useBreadCrumb.tsx";
import {usePermission} from "@/hooks/usePermission.ts";

interface PageHierarchyProps {
    items?: BreadcrumbType[]
    hasButton?: boolean,
    hasDropdownButton?: boolean,
    onClick?: () => void,
    icon?: ReactNode,
    label?: ReactNode,
    dropdownItems?: ItemType[]
    type?: "default" | "primary" | "dashed" | "link" | "text",
}

export const ListPageHierarchy = (
    {
        items, hasButton, onClick, type = 'primary', icon, label, hasDropdownButton, dropdownItems
    }: PageHierarchyProps
) => {
    const {canCreate} = usePermission()
    const {context} = useBreadCrumb({
        bCItems: items as [],
    })

    return(
        <Flex align="center" justify='space-between'>
            {context}
            {canCreate && hasButton && <div className='add__btn__wrapper'>
                <Button onClick={onClick} type={type} icon={icon} className='add__btn'>{label}</Button>
            </div>}
            {canCreate && hasDropdownButton && <ActionButton
                icon={icon}
                items={dropdownItems}
                arrow={true}
            />}

        </Flex>
    )
}