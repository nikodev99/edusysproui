import {useLocation} from "react-router-dom";

const UserViewPage = () => {

    const location = useLocation()
    const {state: userId} = location

    console.log("USER ID: ", userId)

    return (
        <div>View User Page</div>
    )
}

export default UserViewPage;