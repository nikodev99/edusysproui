import './App.scss'
import {RouterProvider} from "react-router-dom";
import {Route} from "./router";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import frFR from "antd/locale/fr_FR";
import {ConfigProvider} from "antd";
import {UserProvider} from "./providers/UserProvider.tsx";

const App = () => {

    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 5_000
            }
        }
    })

    return(
        <UserProvider>
            <ConfigProvider locale={frFR} theme={{
                token: {
                    colorPrimary: '#000C40',
                    fontFamily: '"Work Sans", Helvetica, sans-serif',
                },
                components: {
                    Timeline: {
                        dotBg: 'transparent',
                    }
                }
            }}>
                <QueryClientProvider client={queryClient}>
                    <RouterProvider router={Route} />
                </QueryClientProvider>
            </ConfigProvider>
        </UserProvider>
    )
}

export default App
