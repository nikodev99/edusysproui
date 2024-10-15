import './App.scss'
import {RouterProvider} from "react-router-dom";
import {Route} from "./router";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import frFR from "antd/locale/fr_FR";
import {ConfigProvider} from "antd";

const App = () => {

    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 5_000
            }
        }
    })

    return(
        <ConfigProvider locale={frFR} theme={{
            token: {colorPrimary: '#000C40'},
        }}>
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={Route} />
            </QueryClientProvider>
        </ConfigProvider>
    )
}

export default App
