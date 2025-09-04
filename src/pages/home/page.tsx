import {useDocumentTitle} from "../../hooks/useDocumentTitle.ts";
import {useMemo} from "react";
import {loggedUser} from "../../auth/jwt/LoggedUser.ts";

const Dashboard = () => {
    useDocumentTitle({
        title: "EduSysPro - Dashboard",
        description: "Dashboard description",
        hasEdu: false,
    })

    const school = useMemo(() => loggedUser.getSchool(), [])

    return (
        <main>
            Dashboard
            <div>
                <pre>{JSON.stringify(school)}</pre>
                {/*<div>{loggedUser.getToken()}</div>*/}
            </div>
        </main>
    )
}

export default Dashboard