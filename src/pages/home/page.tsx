import {useDocumentTitle} from "../../hooks/useDocumentTitle.ts";
import {useMemo} from "react";
import {loggedUser} from "../../auth/jwt/LoggedUser.ts";
import {Typography} from "antd";

const Dashboard = () => {
    useDocumentTitle({
        title: "EduSysPro - Dashboard",
        description: "Dashboard description",
        hasEdu: false,
    })

    const school = useMemo(() => loggedUser.getSchool(), [])

    console.log(loggedUser.getToken())

    return (
        <main>
            Dashboard
            <div>
                <Typography.Text code>{JSON.stringify(school)}</Typography.Text>
            </div>
        </main>
    )
}

export default Dashboard