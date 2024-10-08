import {useRouteError} from "react-router-dom";

const PageError = () => {

    const error = useRouteError()

    console.error('Page error: ', error)

    return(
        <div>Error occurred</div>
    )
}

export default PageError;