import {useRouteError} from "react-router-dom";

const PageError = () => {

    const error = useRouteError()

    return(
        <div>
            <h1>404 Error</h1>
            <p>
                {error?.error.toString() ?? error?.toString()}
            </p>
        </div>
    )
}

export default PageError;