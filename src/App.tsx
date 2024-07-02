import './App.scss'
import {RouterProvider} from "react-router-dom";
import {Route} from "./router";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const App = () => {

    const queryClient = new QueryClient()

    return(
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={Route} />
        </QueryClientProvider>
    )
}

export default App
