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
import {text} from "../../core/utils/text_display.ts";
import ExamListPage from "../../pages/exam/ExamListPage.tsx";
import AddExamPage from "../../pages/exam/AddExamPage.tsx";
import ExamViewPage from "../../pages/exam/ExamViewPage.tsx";

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
            { path: text.home.path.page[0], element: <Dashboard />},
            { path: text.home.path.page[1], element: <Dashboard />},
            {
                path: 'students',
                children: [
                    { path: text.path.page, element: <StudentListPage />},
                    { path: text.path.new, element: <EnrollStudentPage />},
                    { path: text.path.view, element: <StudentViewPage />}
                ]
            },
            {
                path: 'teachers',
                children: [
                    { path: text.path.page, element: <TeacherListPage /> },
                    { path: text.path.new, element: <AddTeacherPage /> },
                    { path: text.path.view, element: <TeacherViewPage /> }
                ]
            },
            {
                path: 'guardians',
                children: [
                    { path: text.path.page, element: <GuardianListPage /> },
                    { path: text.path.view, element: <GuardianViewPage /> }
                ]
            },
            {
                path: 'classes-and-subjects',
                children: [
                    {path: text.path.page, element: <ClasseSubjectListsPage />},
                    {path: text.cc.group.classe.path.view, element: <ClasseViewPage />},
                    {path: text.cc.group.course.path.view, element: <SubjectViewPage />},
                ]
            },
            {
                path: 'examinations',
                children: [
                    {path: text.path.page, element: <ExamListPage />},
                    {path: text.path.new, element: <AddExamPage />},
                    {path: text.path.view, element: <ExamViewPage />}
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