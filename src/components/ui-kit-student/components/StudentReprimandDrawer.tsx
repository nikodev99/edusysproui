import {Reprimand} from "../../../entity";
import RightSidePane from "../../ui/layout/RightSidePane.tsx";
import {Descriptions, Skeleton, Typography} from "antd";
import Datetime from "../../../core/datetime.ts";
import Tag from "../../ui/layout/Tag.tsx";
import {punishmentStatusTag} from "../../../entity/enums/punishmentStatus.ts";
import {ReprimandType} from "../../../entity/enums/reprimandType.ts";
import {setFirstName} from "../../../core/utils/utils.ts";
import {LuCalendarCheck, LuCalendarDays} from "react-icons/lu";

export const StudentReprimandDrawer = ({reprimand, open, close}: {
    reprimand: Reprimand,
    open: boolean,
    close: () => void
}) => {
    const {Text} = Typography

    const [color, text] = punishmentStatusTag(reprimand?.punishment?.status)

    return(
        <RightSidePane open={open} onClose={close} title={`Détails — ${reprimand?.student?.personalInfo?.firstName}`} destroyOnClose>
            {reprimand ? (<div>
                <Descriptions title='Réprimande' style={{width: '100%'}} items={[
                    {key: '1', label: 'Date', children: Datetime.of(reprimand?.reprimandDate).fDate(), span: 3},
                    {key: '2', label: 'Faute', children: <Tag color={'danger'}>{ReprimandType[reprimand?.type]}</Tag>, span: 3},
                    {key: '3', label: 'Description', children: '', span: 3},
                    {key: '4', children: <div>{reprimand?.description}</div>, span: 3},
                    {key: '5', label: 'Émis par', children: setFirstName(`${reprimand?.issuedBy?.lastName} ${reprimand?.issuedBy?.firstName}`), span: 3},
                ]} />
                {reprimand.punishment ?
                    <Descriptions title='Sanction' style={{width: '100%', marginTop: '20px'}} items={[
                        {key: '1', label: 'Punition', children: <Tag color='warning'>{reprimand?.punishment?.type}</Tag>, span: 3},
                        {key: '2', label: 'Description', children: '', span: 3},
                        {key: '3', children: reprimand?.punishment?.description, span: 3},
                        {key: '4', label: 'Période', children: '', span: 3},
                        {key: '5', label: <LuCalendarDays />, children: reprimand?.punishment?.startDate ? Datetime.of(reprimand?.punishment?.startDate).format("DD/MM/YYYY") : "—", span: 2},
                        {key: '6', label: <LuCalendarCheck />, children: reprimand?.punishment?.endDate ? Datetime.of(reprimand?.punishment?.endDate).format("DD/MM/YYYY") : "—", span: 1},
                        {key: '7', label: 'Exécuté par', children: reprimand?.punishment?.executedBy ? reprimand?.punishment?.executedBy : '-', span: 3},
                        {key: '8', label: 'Status', children: <Tag color={color}>{text}</Tag>, span: 3},
                        {key: '9', label: 'En appel', children: <div>
                            {reprimand?.punishment?.appealed ? (
                                <Tag color='success'>Oui</Tag>
                            ) : (
                                <Tag color="processing">Non</Tag>
                            )}
                            {reprimand?.punishment?.appealedNote && (
                                <div style={{ marginTop: 6, color: "var(--ant-gray-6)" }}>{reprimand?.punishment?.appealedNote}</div>
                            )}
                        </div>, span: 3},
                    ]} /> : (
                    <Text type="secondary">Aucune sanction associée à cette réprimande.</Text>
                )}
            </div>) : (
                <Skeleton active={reprimand === null} />
            )}
        </RightSidePane>
    )
}