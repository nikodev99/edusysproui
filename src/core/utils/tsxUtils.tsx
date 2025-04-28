import {getStatusKey, Status} from "../../entity/enums/status.ts";
import {ReactNode} from "react";
import Tag from "../../components/ui/layout/Tag.tsx";
import {Button, Card, Descriptions, Flex, Popover, Skeleton, Space, StepsProps, Tooltip, Typography} from "antd";
import {Color} from "./interfaces.ts";
import {MarkType} from "../../entity/enums/MarkType.ts";
import {Assignment} from "../../entity";
import {LuCalendarDays, LuClock, LuClock9, LuRefreshCcw, LuX} from "react-icons/lu";
import Datetime from "../datetime.ts";
import {dateCompare, setName, setTime} from "./utils.ts";
import {ModalConfirmButton} from "../../components/ui/layout/ModalConfirmButton.tsx";
import {redirectTo} from "../../context/RedirectContext.ts";
import {text} from "./text_display.ts";

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

export const IconText = ({ icon, text, color }: {
    icon: ReactNode;
    text: string | ReactNode,
    color?: Color
}) => (
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
            <span key={matchIndex} style={{padding: 0, margin: 0}}>
                {digit}
                <span style={{
                    ...(isUpper ? {textTransform: 'uppercase'}: {}),
                    fontSize: `${textSize}em`,
                    verticalAlign: 'super',
                    padding: 0, margin: 0
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
        <p style={isUpper ? { textTransform: 'uppercase', padding: 0, margin: 0 } : { padding: 0, margin: 0 }}>
            {parts}
        </p>
    );
}

export const CardSkeleton = ({title}: {title?: ReactNode}) => {
    return <Card title={title} style={{ width: '100%', height: '100%' }}>
        <Skeleton active />
    </Card>
}

export const AssignmentDescription = (
    {a, show, plus, remove, showBest, openUpdater, link}: {
        a: Assignment, title?: ReactNode, show?: boolean,
        plus?: boolean, remove?: (id?: bigint) => void, showBest?: boolean,
        openUpdater?: () => void
        link?: string
    }
) => {

    const {Link, Text} = Typography

    return <Descriptions items={[
        ...(show ? [{key: 1, label: 'Titre', children: link ? <Link onClick={() => redirectTo(link)}>{a?.examName}</Link> : a?.examName, span: 3}] : []),
        ...(a?.semester?.semester ? [{key: 2, label: 'Semestre', children: a?.semester?.semester?.semesterName, span: 3}] : []),
        ...(a?.exam?.examType ? [{key: 3, label: 'Examen', children: a?.exam?.examType?.name, span: 3}] : []),
        ...(a?.subject ? [{key: 4, label: 'Matière', children: <Text onClick={() => redirectTo(text.cc.group.course.view.href + a?.subject?.id)} className='course-Link'>
                {a?.subject?.course}
        </Text>, span: 3}] : []),
        ...(a?.classe ? [{key: 12, label: 'Classe', children: <Text onClick={() => redirectTo(text.cc.group.classe.view.href + a?.classe?.id)} className='course-Link'>
                <SuperWord input={a?.classe?.name} />
        </Text>, span: 3}] : []),
        ...(a && plus ? [{key: 5, label: undefined, children: <IconText color='#8f96a3' icon={<LuCalendarDays />} text={Datetime.of(a?.examDate as number[]).fDate('D MMM YYYY') as string} key="1" />}]: []),
        ...(a && plus ? [{key: 6, label: undefined, children: <IconText color='#8f96a3' icon={<LuClock />} text={setTime(a?.startTime as []) as string} key="2" />}]: []),
        ...(a && plus ? [{key: 7, label: undefined, children: <IconText color='#8f96a3' icon={<LuClock9 />} text={setTime(a?.endTime as []) as string} key="3" />}]: []),
        {key: 8, label: 'Status', children: <Space>
                <Tag color={!a?.passed ? 'warning': 'success'}>{!a?.passed ? 'Programmé' : 'Traité'}</Tag>
                {a?.passed ? undefined : !dateCompare(a?.examDate as Date) ? <Tag color='danger'>Date Dépassée</Tag> : undefined}
            </Space>, span: 3},
        ...(a?.preparedBy ? [
            {key: 9, label: 'Préparer par', children: <span>{setName(a?.preparedBy?.lastName, a?.preparedBy?.firstName)}</span>, span: 3},
            {key: 10, label: 'Mise à jour', children: <span>{Datetime.of(a?.updatedDate as number).fDatetime()}</span>, span: 3}
        ] : []),

        ...(
            a?.passed ? [] : dateCompare(a?.examDate as Date) ? [] : showBest ? [{key: 11, children: <Space.Compact block>
                    <ModalConfirmButton handleFunc={remove ? remove : () => 'forbidden'} funcParam={a?.id} btnTxt={<LuX />} />
                    <Tooltip title="Changer de date"> {/* TODO Gérer les boutons supprimer et changer de date */}
                        <Button onClick={openUpdater} icon={<LuRefreshCcw />} />
                    </Tooltip>
                </Space.Compact>}]: []
        )
    ]} />
}

export const InitMarkType = ({av}: {av: number}) => {
    let color: string;
    let text: MarkType;

    if (av >= 18) {
        text = MarkType.EX;
        color = 'success';
    } else if (av >= 16) {
        text = MarkType.TB;
        color = 'success';
    } else if (av >= 14) {
        text = MarkType.GOOD;
        color = 'processing';
    } else if (av >= 12) {
        text = MarkType.AB;
        color = 'processing';
    }else if (av >= 10) {
        text = MarkType.PA;
        color = 'warning';
    }else if (av >= 8) {
        text = MarkType.IN;
        color = 'warning';
    }else if (av >= 6) {
        text = MarkType.FA;
        color = 'danger';
    } else {
        text = MarkType.TF;
        color = 'danger';
    }

    return (
        <Tag color={color as 'warning'}>{text}</Tag>
    );
};