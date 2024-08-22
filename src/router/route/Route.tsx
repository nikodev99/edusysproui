import {createBrowserRouter} from "react-router-dom";
import PageLayout from "../../pages/PageLayout.tsx";
import PageError from "../../pages/PageError.tsx";
import Dashboard from "../../pages/dashboard/page.tsx";
import StudentList from "../../pages/student/StudentList.tsx";
import Inscription from "../../pages/student/Inscription.tsx";
import Setting from "../../pages/setting/page.tsx";
import StudentView from "../../pages/student/StudentView.tsx";
import RedirectProvider from "../../global/RedirectProvider.tsx";

export const Route = createBrowserRouter([
    {
        path: '/',
        element: (
            <RedirectProvider>
                <PageLayout />
            </RedirectProvider>
        ),
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
                path: 'students',
                children: [
                    {
                        path: '',
                        element: <StudentList />
                    },
                    {
                        path: "new",
                        element: <Inscription />
                    },
                    {
                        path: ':id',
                        element: <StudentView />
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