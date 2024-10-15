import {getStatusKey, Status} from "../entity/enums/status.ts";
import React, {ReactNode} from "react";
import Tag from "../components/ui/layout/Tag.tsx";
import {Popover, StepsProps} from "antd";

export const statusTags = (status: Status, female?: boolean): ReactNode => {
    const label = getStatusKey(status, female)
    switch (status) {
        case Status.CELIBATAIRE:
            return <Tag color='processing'>{label}</Tag>
        case Status.MARIE:
            return <Tag color='success'>{label}</Tag>
        case Status.VEUF:
        case Status.VEUVE:
            return <Tag color='warning'>{label}</Tag>
        case Status.CONCUBIN:
            return <Tag color='warning'>{label}</Tag>
        case Status.DIVORCE:
            return <Tag color='danger'>{label}</Tag>
        case Status.PACSE:
            return <Tag color='success'>{label}</Tag>
        case Status.SEPARE:
            return <Tag color='processing'>{label}</Tag>
        default:
            return <Tag color='danger'>Inconnu</Tag>
    }
}

export const requiredMark = (label: React.ReactNode, {required}: {required: boolean}) => (
    <>
        {required ? <Tag color='danger'>requis</Tag> : <Tag color='warning'>optionnel</Tag>}&nbsp;{label}
    </>
)

export const customDot: StepsProps['progressDot'] = (dot: ReactNode, {status, index}) => (
    <Popover content={<span>
        étape: {index + 1} status: {status}
    </span>}>
        {dot}
    </Popover>
)