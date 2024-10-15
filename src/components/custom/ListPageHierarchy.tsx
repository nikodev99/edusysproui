import PageHierarchy from "../breadcrumb/PageHierarchy.tsx";
import {ReactNode} from "react";
import {Button, Flex} from "antd";

interface PageHierarchyProps {
    items?: [{title: string | ReactNode, path?: string}]
    hasButton?: boolean,
    onClick?: () => void,
    icon?: ReactNode,
    label?: ReactNode,
    type?: "default" | "primary" | "dashed" | "link" | "text",
}

export const ListPageHierarchy = ({items, hasButton, onClick, type, icon, label}: PageHierarchyProps) => {
    return(
        <Flex align="center" justify='space-between'>
            <PageHierarchy items={items} />
            {hasButton && <div className='add__btn__wrapper'>
                <Button onClick={onClick} type={type} icon={icon}
                        className='add__btn'>{label}</Button>
            </div>}

        </Flex>
    )
}