import {createBrowserRouter} from "react-router-dom";
import PageLayout from "../pages/PageLayout.tsx";
import PageError from "../pages/PageError.tsx";
import Dashboard from "../pages/dashboard/page.tsx";
import Setting from "../pages/setting/page.tsx";
import Inscription from "../pages/student/Inscription.tsx";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <PageLayout />,
        errorElement: <PageError />,
        children: [
            {
                path: 'dashboard',
                element: <Dashboard />
            },
            {
                path: 'students',
                children: [
                    {
                        path: "new",
                        element: <Inscription />
                    }
                ]
            },
            {
                path: 'settings',
                element: <Setting />
            }
        ]
    }
])