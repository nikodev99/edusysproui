import './App.scss'
import {RouterProvider} from "react-router-dom";
import {Route} from "./router";

const App = () => {

    return(
        <RouterProvider router={Route} />
    )
}

export default App
