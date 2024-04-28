import './App.scss'
import {metadata} from "./utils/metadata.ts";
import {RouterProvider} from "react-router-dom";
import {router} from "./router/router.tsx";

metadata({
    title: "Dashboard",
    description: "New Home Page"
});

const App = () => {

    return(
        <RouterProvider router={router} />
    )
}

export default App
