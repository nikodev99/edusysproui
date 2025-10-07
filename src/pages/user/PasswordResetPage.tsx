import {useLocation, useParams} from "react-router-dom";
import {useFetch} from "../../hooks/useFetch.ts";
import {validateToken} from "../../auth/services/AuthService.ts.tsx";

const PasswordResetPage = () => {
    const location = useLocation()
    const { token } = useParams()

    console.log("What in the location: ", location)
    console.log("What in the params: ", token)

    const {data: validateUser} = useFetch(['validate-token'], validateToken, [token], !!token)

    return (
        <div>Ici réinitialiser votre mot de passe</div>
    )
}

export default PasswordResetPage