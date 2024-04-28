import {createBrowserRouter} from "react-router-dom";
import PageLayout from "../pages/PageLayout.tsx";
import PageError from "../pages/PageError.tsx";
import Dashboard from "../pages/dashboard/page.tsx";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <PageLayout />,
        errorElement: <PageError />,
        children: [
            {
                path: 'dashboard',
                element: <Dashboard />
            }
        ]
    }
])