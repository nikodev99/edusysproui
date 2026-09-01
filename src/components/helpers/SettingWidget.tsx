import {ReactNode} from "react";
import {Card, Typography} from "antd";

export type SettingWidgetProps = {
    icon: ReactNode, title: ReactNode, desc: ReactNode, toView?: () => void
}

export const SettingWidget = ({icon, title, desc, toView}: SettingWidgetProps) => {
    return (
        <Card>
            <Card.Meta
                title={<Typography.Link onClick={toView}
                    style={{
                        display: 'flex',
                        fontSize: 18,
                        alignItems: 'center',
                        justifyContent: 'start',
                        gap: 5
                    }}>
                    {icon} {title}
                </Typography.Link>}
            />
            {desc}
        </Card>
    )
}