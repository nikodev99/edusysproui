import {Alert, Card, Divider} from "antd";
import {ReactNode} from "react";
import Marquee from "react-fast-marquee";

export const SettingCard = ({title, alert = false, isMarquee = false, description, children}: {
    title: ReactNode,
    alert?: boolean | {type: 'success' | 'error' | 'info' | 'warning'},
    description?: ReactNode,
    isMarquee?: boolean,
    children?: ReactNode
}) => {
    return (
        <Card size='small'>
            <Card.Meta title={title} />
            <Divider />
            {description && alert && <Alert message={description} type={typeof alert === 'boolean' ? 'warning': alert.type} />}
            {description && isMarquee && <Marquee pauseOnHover>{description}</Marquee>}
            {description}
            {description && <Divider />}
            {children}
        </Card>
    )
}