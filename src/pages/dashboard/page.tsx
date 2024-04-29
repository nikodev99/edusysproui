import {Layout} from "antd";
import {useDocumentTitle} from "../../hooks/useDocumentTitle.ts";

const Dashboard = () => {
    useDocumentTitle({
        title: "EduSysPro - Dashboard",
        description: "Dashboard description",
    })

    return (
        <Layout.Content>
            <div>Dashboard</div>
        </Layout.Content>
    )
}

export default Dashboard