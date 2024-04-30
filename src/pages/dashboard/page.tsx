import {useDocumentTitle} from "../../hooks/useDocumentTitle.ts";

const Dashboard = () => {
    useDocumentTitle({
        title: "EduSysPro - Dashboard",
        description: "Dashboard description",
    })

    return (
        <main>Dashboard</main>
    )
}

export default Dashboard