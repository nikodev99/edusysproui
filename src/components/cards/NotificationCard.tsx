import {Bell} from "lucide-react";
import {Badge, Dropdown, List, MenuProps} from "antd";

const NotificationCard = () => {

    const items: MenuProps['items'] = [
        {
            key: '1',
            label: <List.Item>
                <List.Item.Meta title="Notification 1" description="Descriptionn 1" />
            </List.Item>
        },
        {
            key: '2',
            label: <List.Item>
                <List.Item.Meta title="Notification 2" description="Descriptionn 2" />
            </List.Item>
        },
        {
            key: '3',
            label: <List.Item>
                <List.Item.Meta title="Notification 3" description="Descriptionn 3" />
            </List.Item>
        }
    ];

    return(
        <Dropdown menu={{items}}>
            <Badge dot>
                <Bell className='header-icon'/>
            </Badge>
        </Dropdown>
    )
}

export default NotificationCard;