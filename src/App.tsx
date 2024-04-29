import './App.scss'
import {RouterProvider} from "react-router-dom";
import {router} from "./router/router.tsx";

const App = () => {

    return(
        <RouterProvider router={router} />
    )
}

export default App
