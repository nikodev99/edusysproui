import {Menu} from 'antd'
import {Link} from "react-router-dom";

const SidebarNav = ({key, icon, label, to}: {key: string, icon: string, label: string, to: string}) => {
    return(
        <Menu.Item key={key}>
            <Link to={to}>
                {icon}
                <span>{label}</span>
            </Link>
        </Menu.Item>
    )
}

export default SidebarNav