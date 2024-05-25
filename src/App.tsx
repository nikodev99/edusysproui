import './App.scss'
import {RouterProvider} from "react-router-dom";
import {Router} from "./router";

const App = () => {

    return(
        <RouterProvider router={Router} />
    )
}

export default App
