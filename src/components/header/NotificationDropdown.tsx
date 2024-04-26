import {List} from "antd";

const NotificationDropdown = () => {

    const items = [
        {
            key: '1',
            title: <a href='#'>'Notification 1'</a>,
            desc: 'Notification 1 description',
        },
        {
            key: '2',
            title: <a href='#'>'Notification 2'</a>,
            desc: 'Notification 2 description'
        },
        {
            key: '3',
            title: <a href='#'>'Notification 3'</a>,
            desc: 'Notification 3 description'
        }
    ];

    return(
        <>
            {items.map((item) => (
                <List.Item key={item.key}>
                    <List.Item.Meta title={item.title} description={item.desc} />
                </List.Item>
            ))}
        </>
    )
}

export default NotificationDropdown