import {ReactNode} from 'react';
import { Tag as AntTag } from 'antd';
import Tag from "./Tag.tsx"; // Assuming you're using Ant Design Tag

type SwitchTagProps = {
    mustSwitch: boolean;
    useCustom?: boolean;
    texts?: { success?: string, failed?: string };
    icons?: { success?: ReactNode, failed?: ReactNode };
}

export const SwitchTag = (
    {mustSwitch, texts, useCustom, icons}: SwitchTagProps
) => {

    return (
        <>{
            mustSwitch
                ? useCustom
                    ? (<Tag color='success' icon={icons?.success}>{texts?.success}</Tag>)
                    : (<AntTag icon={icons?.success} color='success'>{texts?.success}</AntTag>)
                : useCustom
                    ? (<Tag color='danger' icon={icons?.failed}>{texts?.failed}</Tag>)
                    :(<AntTag icon={icons?.failed} color='error'>{texts?.failed}</AntTag>)
        }</>
    )
}