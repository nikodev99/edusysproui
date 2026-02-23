import {useDocumentTitle} from "@/hooks/useDocumentTitle.ts";
import {useMemo} from "react";
import {loggedUser} from "@/auth/jwt/LoggedUser.ts";
import {Typography} from "antd";
import {useGlobalStore} from "@/core/global/store.ts";
import {jwtTokenManager} from "@/auth/jwt/JWTToken.ts";

const Dashboard = () => {
    useDocumentTitle({
        title: "EduSysPro - Dashboard",
        description: "Dashboard description",
        hasEdu: false,
    })

    const school = useMemo(() => loggedUser.getSchool(), [])
    const schoolGlobal = useGlobalStore(state => state.schoolId)

    const token = jwtTokenManager.decodeToken()

    console.log(token)

    return (
        <main>
            Dashboard
            <div>
                <Typography.Text code>{JSON.stringify(school)}</Typography.Text>
                <Typography.Text code>{JSON.stringify(schoolGlobal)}</Typography.Text>
            </div>
        </main>
    )
}

export default Dashboard