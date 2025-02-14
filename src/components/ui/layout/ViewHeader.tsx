import {Button, Dropdown, Flex, Skeleton} from "antd";
import {LuChevronDown, LuPencil} from "react-icons/lu";
import {useToggle} from "../../../hooks/useToggle.ts";
import {ReactNode, useEffect, useState} from "react";
import {ItemType} from "antd/es/menu/interface";
import {AvatarProps} from "../ui_interfaces.ts";
import {AvatarTitle} from "./AvatarTitle.tsx";
import {assignKeys} from "../../../utils/utils.ts";

interface ViewProps {
    isLoading: boolean,
    setEdit: (toEdit: boolean) => void
    closeState: boolean
    avatarProps: AvatarProps
    blockProps:{title: ReactNode, mention: ReactNode}[]
    items?: ItemType[]
    btnLabel?: ReactNode
    pColor?: (color: string) => void
    upperName ?: boolean
    editText?: ReactNode
}

const ViewHeader = (
    {isLoading, setEdit, closeState, avatarProps, blockProps, items, btnLabel, pColor, upperName, editText}: ViewProps
) => {

    const [color, setColor] = useState<string>('')
    const [open, setOpen] = useToggle(false);

    useEffect(() => {
        if (pColor) {
            pColor(color)
        }
        if (closeState !== open) {
            setOpen()
        }
    }, [closeState, color, open, pColor, setOpen]);

    if (isLoading) {
        return (
            <Skeleton loading={isLoading} active={isLoading} avatar paragraph={{rows: 2}} />
        )
    }

    const handleClick = () => {
        setOpen()
        setEdit(!open)
    }

    const baseItems: ItemType[] = [
        {key: 1, label: editText ?? 'Editer', icon: <LuPencil />, onClick: handleClick},
    ]
    const additionalItems = items ? items : []

    return(
        <Flex align='center' justify='space-between' component='header' className='view__block'>
            <AvatarTitle {...avatarProps} setColor={setColor} isUpper={upperName} />

            {blockProps && blockProps.map(({title, mention}, index) => (
                <Flex className='block' align='flex-start' vertical gap={4} key={index}>
                    <div>{title}</div>
                    <div>{mention}</div>
                </Flex>
            ))}

            <Flex className='block' align='flex-start' vertical gap={4}>
                <Dropdown arrow menu={{items: assignKeys(baseItems, additionalItems)}} trigger={['click']}>
                    <Button className='add__btn' style={{background: color}} icon={<LuChevronDown size={18} />} iconPosition='end'>
                        {btnLabel ? btnLabel : 'Gérer'}
                    </Button>
                </Dropdown>
            </Flex>
        </Flex>
    )
}

export default ViewHeader