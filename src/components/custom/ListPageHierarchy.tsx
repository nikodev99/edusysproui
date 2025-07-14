import PageHierarchy from "../breadcrumb/PageHierarchy.tsx";
import {ReactNode} from "react";
import {Button, Flex} from "antd";
import {ItemType} from "antd/es/menu/interface";
import {ActionButton} from "../ui/layout/ActionButton.tsx";

interface PageHierarchyProps {
    items?: [{title: string | ReactNode, path?: string}]
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
    return(
        <Flex align="center" justify='space-between'>
            <PageHierarchy items={items} />
            {hasButton && <div className='add__btn__wrapper'>
                <Button onClick={onClick} type={type} icon={icon} className='add__btn'>{label}</Button>
            </div>}
            {hasDropdownButton && <ActionButton
                icon={icon}
                items={dropdownItems}
                arrow={true}
            />}

        </Flex>
    )
}