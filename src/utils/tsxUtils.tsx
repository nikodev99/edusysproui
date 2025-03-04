import {getStatusKey, Status} from "../entity/enums/status.ts";
import {ReactNode} from "react";
import Tag from "../components/ui/layout/Tag.tsx";
import {Flex, Popover, Space, StepsProps} from "antd";
import {Color} from "./interfaces.ts";

export const StatusTags = ({status, female}: {status: Status, female?: boolean}): ReactNode => {
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

export const RequiredMark = (label: ReactNode, {required}: {required: boolean}) => (
    <>
        {required ? <Tag color='danger'>requis</Tag> : <Tag color='warning'>optionnel</Tag>}&nbsp;{label}
    </>
)

export const CustomDot: StepsProps['progressDot'] = (dot: ReactNode, {status, index}) => (
    <Popover content={<span>
        étape: {index + 1} status: {status}
    </span>}>
        {dot}
    </Popover>
)

export const IconText = ({ icon, text, color }: { icon: ReactNode; text: string, color?: Color }) => (
    <Space>
        <Flex gap={10} align='center' style={color ? {color: color} : undefined}>
            {icon}
            {text}
        </Flex>
    </Space>
);

export const SuperWord = ({ input, isUpper, textSize = .6 }: { input: string; isUpper?: boolean, textSize?: number /** @range {0-1} */ }) => {
    const regex = /\b(\d)([a-zA-Z]{1,3})\b/g;

    const parts: (string | ReactNode)[] = [];
    let lastIndex = 0;
    let match;

    while ((match = regex?.exec(input)) !== null) {
        const [fullMatch, digit, letters] = match;
        const matchIndex = match?.index;

        if (matchIndex > lastIndex) {
            parts.push(input?.substring(lastIndex, matchIndex));
        }

        parts.push(
            <span key={matchIndex}>
                {digit}
                <span style={{
                    ...(isUpper ? {textTransform: 'uppercase'}: {}),
                    fontSize: `${textSize}em`,
                    verticalAlign: 'super'
                }}>
                    {letters}
                </span>
            </span>
        )
        lastIndex = matchIndex + fullMatch?.length;
    }

    if (lastIndex < input?.length) {
        parts.push(input.substring(lastIndex));
    }

    return (
        <p style={isUpper ? { textTransform: 'uppercase' } : {}}>
            {parts}
        </p>
    );
}