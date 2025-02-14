import {createBrowserRouter} from "react-router-dom";
import PageLayout from "../../pages/PageLayout.tsx";
import PageError from "../../pages/PageError.tsx";
import Dashboard from "../../pages/dashboard/page.tsx";
import StudentListPage from "../../pages/student/StudentListPage.tsx";
import EnrollStudentPage from "../../pages/student/EnrollStudentPage.tsx";
import StudentViewPage from "../../pages/student/StudentViewPage.tsx";
import RedirectProvider from "../../providers/RedirectProvider.tsx";
import TeacherListPage from "../../pages/teacher/TeacherListPage.tsx";
import GuardianListPage from "../../pages/guardian/GuardianListPage.tsx";
import GuardianViewPage from "../../pages/guardian/GuardianViewPage.tsx";
import AddTeacherPage from "../../pages/teacher/AddTeacherPage.tsx";
import TeacherViewPage from "../../pages/teacher/TeacherViewPage.tsx";
import {Organization} from "../../pages/setting/Organization.tsx";
import ClasseSubjectListsPage from "../../pages/classe_subject/ClasseSubjectListsPage.tsx";
import ClasseViewPage from "../../pages/classe_subject/ClasseViewPage.tsx";
import SubjectViewPage from "../../pages/classe_subject/SubjectViewPage.tsx";

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
                    { path: '', element: <StudentListPage />},
                    { path: "new", element: <EnrollStudentPage />},
                    { path: ':id', element: <StudentViewPage />}
                ]
            },
            {
                path: 'teachers',
                children: [
                    { path: '', element: <TeacherListPage /> },
                    { path: 'new', element: <AddTeacherPage /> },
                    { path: ':id', element: <TeacherViewPage /> }
                ]
            },
            {
                path: 'guardians',
                children: [
                    { path: '', element: <GuardianListPage /> },
                    { path: ':id', element: <GuardianViewPage /> }
                ]
            },
            {
                path: 'classes-and-subjects',
                children: [
                    {path: '', element: <ClasseSubjectListsPage />},
                    {path: 'classe/:id', element: <ClasseViewPage />},
                    {path: 'subject/:id', element: <SubjectViewPage />},
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