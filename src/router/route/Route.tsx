import {createBrowserRouter} from "react-router-dom";
import PageLayout from "../../pages/PageLayout.tsx";
import PageError from "../../pages/PageError.tsx";
import Dashboard from "../../pages/dashboard/page.tsx";
import StudentList from "../../pages/student/StudentList.tsx";
import Inscription from "../../pages/student/Inscription.tsx";
import Setting from "../../pages/setting/page.tsx";

export const Route = createBrowserRouter([
    {
        path: '/',
        element: <PageLayout />,
        errorElement: <PageError />,
        children: [
            {
                path: '/',
                element: <Dashboard />
            },
            {
                path: 'dashboard',
                element: <Dashboard />
            },
            {
                path: 'student',
                children: [
                    {
                        path: 'all',
                        element: <StudentList />
                    },
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