import {useLocation, useParams} from "react-router-dom";

const PasswordResetPage = () => {
    const location = useLocation()
    const params = useParams()

    console.log("What in the location: ", location)
    console.log("What in the params: ", params)

    return (
        <div>Ici réinitialiser votre mot de passe</div>
    )
}

export default PasswordResetPage