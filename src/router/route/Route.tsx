import {createBrowserRouter} from "react-router-dom";
import PageLayout from "../../pages/PageLayout.tsx";
import PageError from "../../pages/PageError.tsx";
import Dashboard from "../../pages/dashboard/page.tsx";
import StudentList from "../../pages/student/StudentList.tsx";
import Inscription from "../../pages/student/Inscription.tsx";
import StudentView from "../../pages/student/StudentView.tsx";
import RedirectProvider from "../../providers/RedirectProvider.tsx";
import TeacherList from "../../pages/teacher/TeacherList.tsx";
import GuardianList from "../../pages/guardian/GuardianList.tsx";
import GuardianView from "../../pages/guardian/GuardianView.tsx";
import AddTeacher from "../../pages/teacher/AddTeacher.tsx";
import TeacherView from "../../pages/teacher/TeacherView.tsx";
import {Organization} from "../../pages/setting/Organization.tsx";

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
            { path: '/', element: <Dashboard />},
            { path: 'dashboard', element: <Dashboard />},
            {
                path: 'students',
                children: [
                    { path: '', element: <StudentList />},
                    { path: "new", element: <Inscription />},
                    { path: ':id', element: <StudentView />}
                ]
            },
            {
                path: 'teachers',
                children: [
                    { path: '', element: <TeacherList /> },
                    { path: 'new', element: <AddTeacher /> },
                    { path: ':id', element: <TeacherView /> }
                ]
            },
            {
                path: 'guardians',
                children: [
                    { path: '', element: <GuardianList /> },
                    { path: ':id', element: <GuardianView /> }
                ]
            },
            {
                path: 'settings',
                children: [
                    {path: 'organization', element: <Organization />}
                ]
            }
        ]
    }
])