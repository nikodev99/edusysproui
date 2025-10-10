import {createBrowserRouter, Navigate} from "react-router-dom";
import PageLayout from "../../pages/PageLayout.tsx";
import PageError from "../../pages/errors/PageError.tsx";
import Dashboard from "../../pages/home/page.tsx";
import StudentListPage from "../../pages/student/StudentListPage.tsx";
import EnrollStudentPage from "../../pages/student/EnrollStudentPage.tsx";
import StudentViewPage from "../../pages/student/StudentViewPage.tsx";
import TeacherListPage from "../../pages/teacher/TeacherListPage.tsx";
import GuardianListPage from "../../pages/guardian/GuardianListPage.tsx";
import GuardianViewPage from "../../pages/guardian/GuardianViewPage.tsx";
import AddTeacherPage from "../../pages/teacher/AddTeacherPage.tsx";
import TeacherViewPage from "../../pages/teacher/TeacherViewPage.tsx";
import {OrganizationPage} from "../../pages/org/OrganizationPage.tsx";
import ClasseSubjectListsPage from "../../pages/classe_subject/ClasseSubjectListsPage.tsx";
import ClasseViewPage from "../../pages/classe_subject/ClasseViewPage.tsx";
import SubjectViewPage from "../../pages/classe_subject/SubjectViewPage.tsx";
import {text} from "../../core/utils/text_display.ts";
import ExamListPage from "../../pages/exam/ExamListPage.tsx";
import AddExamPage from "../../pages/exam/AddExamPage.tsx";
import ExamViewPage from "../../pages/exam/ExamViewPage.tsx";
import AttendancePage from "../../pages/attendance/AttendancePage.tsx";
import AttendanceAddPage from "../../pages/attendance/AttendanceAddPage.tsx";
import {AttendanceEditPage} from "../../pages/attendance/AttendanceEditPage.tsx";
import LibraryListPage from "../../pages/library/LibraryListPage.tsx";
import FinanceDashboardPage from "../../pages/finance/FinanceDashboardPage.tsx";
import MessagePage from "../../pages/chat/MessagePage.tsx";
import EmployeeListPage from "../../pages/employee/EmployeeListPage.tsx";
import LoginPage from "../../pages/user/LoginPage.tsx";
import RedirectProvider from "../../providers/RedirectProvider.tsx";
import NavigationHandler from "../../providers/NavigationHandler.tsx";
import {AuthMiddleware} from "../../middleware/AuthMiddleware.tsx";
import {withAuthProtection} from "../../middleware/withAuthProtection.tsx";
import LogSchoolPage from "../../pages/user/LogSchoolPage.tsx";
import AddEmployeePage from "../../pages/employee/AddEmployeePage.tsx";
import EmployeeViewPage from "../../pages/employee/EmployeeViewPage.tsx";
import CustomizePage from "../../pages/setting/CustomizePage.tsx";
import AcademicYearPage from "../../pages/org/AcademicYearPage.tsx";
import GradePage from "../../pages/org/GradePage.tsx";
import DepartmentPage from "../../pages/org/DepartmentPage.tsx";
import UserListPage from "../../pages/org/UserListPage.tsx";
import {GradeSavePage} from "../../pages/org/GradeSavePage.tsx";
import GradeEditPage from "../../pages/org/GradeEditPage.tsx";
import {DepartmentViewPage} from "../../pages/org/DepartmentViewPage.tsx";
import {DepartmentAddPage} from "../../pages/org/DepartmentAddPage.tsx";
import {GradeViewPage} from "../../pages/org/GradeViewPage.tsx";
import UserViewPage from "../../pages/org/UserViewPage.tsx";
import UserSavePage from "../../pages/org/UserSavePage.tsx";
import UserActivityPage from "../../pages/org/UserActivityPage.tsx";
import PasswordResetPage from "../../pages/user/PasswordResetPage.tsx";
import ChangePasswordPage from "../../pages/org/ChangePasswordPage.tsx";

const DashboardPage = withAuthProtection(Dashboard);
const ListStudentPage = withAuthProtection(StudentListPage);
const EnrollPage = withAuthProtection(EnrollStudentPage);
const ViewStudentPage = withAuthProtection(StudentViewPage);

const ListTeacherPage = withAuthProtection(TeacherListPage);
const TeacherAddPage = withAuthProtection(AddTeacherPage);
const ViewTeacherPage = withAuthProtection(TeacherViewPage);

const ListEmployeePage = withAuthProtection(EmployeeListPage);
const EmployeeAddPage = withAuthProtection(AddEmployeePage);
const ViewEmployeePage = withAuthProtection(EmployeeViewPage);

const ListAcademicYearPage = withAuthProtection(AcademicYearPage);
const ListGradePage = withAuthProtection(GradePage);
const AddGradePage = withAuthProtection(GradeSavePage);
const EditGradePage = withAuthProtection(GradeEditPage);
const ViewGradePage = withAuthProtection(GradeViewPage);
const AddDepartmentPage = withAuthProtection(DepartmentAddPage);
const ViewDepartmentPage = withAuthProtection(DepartmentViewPage);
const ListDepartmentPage = withAuthProtection(DepartmentPage);
const ListUserPage = withAuthProtection(UserListPage);
const ViewUserPage = withAuthProtection(UserViewPage);
const SaveUserPage = withAuthProtection(UserSavePage)
const UserActivity = withAuthProtection(UserActivityPage)
const UserChangePassword = withAuthProtection(ChangePasswordPage)

const SettingCustomizePage = withAuthProtection(CustomizePage);

export const Route = createBrowserRouter([
    {
        path: '/',
        element: <NavigationHandler requireAuth={false}>
            <LoginPage />
        </NavigationHandler>,
        children: [
            {path: 'login', element: <LoginPage />},
        ]
    },
    {
        path: '/password-reset/:token',
        element: <PasswordResetPage />
    },
    {
        path: '/active_school',
        element: (
            <NavigationHandler>
                <LogSchoolPage />
            </NavigationHandler>
        )
    },
    {
        path: '/:schoolSlug',
        element: (
            <RedirectProvider>
                <AuthMiddleware>
                    <NavigationHandler>
                        <PageLayout />
                    </NavigationHandler>
                </AuthMiddleware>
            </RedirectProvider>
        ),
        errorElement: <PageError />,
        children: [
            { index: true, element: <DashboardPage />},
            { path: text.home.path.page[1], element: <DashboardPage />},
            {
                path: 'students',
                children: [
                    { path: text.path.page, element: <ListStudentPage />},
                    { path: text.path.new, element: <EnrollPage />},
                    { path: text.path.view, element: <ViewStudentPage />}
                ]
            },
            {
                path: 'teachers',
                children: [
                    { path: text.path.page, element: <ListTeacherPage /> },
                    { path: text.path.new, element: <TeacherAddPage /> },
                    { path: text.path.view, element: <ViewTeacherPage /> }
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
                path: 'attendances',
                children: [
                    { path: text.path.page, element: <AttendancePage />},
                    { path: text.path.new, element: <AttendanceAddPage />},
                    { path: text.path.edit, element: <AttendanceEditPage />}
                ]
            },
            {
                path: 'library',
                children: [
                    { path: text.path.page, element: <LibraryListPage /> }
                ]
            },
            {
                path: 'fee-and-finance',
                children: [
                    { path: text.path.page, element: <FinanceDashboardPage /> }
                ]
            },
            {
                path: 'chat',
                children: [
                    { path: text.path.page, element: <MessagePage /> }
                ]
            },
            {
                path: 'staff-management',
                children: [
                    { path: text.path.page, element: <ListEmployeePage /> },
                    { path: text.path.new, element: <EmployeeAddPage /> },
                    { path: text.path.slug, element: <ViewEmployeePage /> }
                ]
            },
            {
                path: 'organization',
                children: [
                    {
                        index: true,
                        element: <Navigate to='/' replace />
                    },
                    {path: 'school', element: <OrganizationPage />},
                    {path: 'academic_year', element: <ListAcademicYearPage />},
                    {
                        path: 'grades',
                        children: [
                            {path: text.path.page, element: <ListGradePage />},
                            {path: text.path.new, element: <AddGradePage />},
                            {path: text.path.slug, element: <EditGradePage />},
                            {path: text.path.view, element: <ViewGradePage />}
                        ]
                    },
                    {
                        path: 'departments',
                        children: [
                            {path: text.path.page, element: <ListDepartmentPage />},
                            {path: text.path.new, element: <AddDepartmentPage />},
                            {path: text.path.slug, element: <ViewDepartmentPage />},
                        ]
                    },
                    {
                        path: 'users',
                        children: [
                            {path: text.path.page, element: <ListUserPage />},
                            {path: text.path.slug, element: <ViewUserPage />},
                            {path: text.path.new, element: <SaveUserPage/>},
                            {path: text.path.slug + '/activity', element: <UserActivity/>},
                            {path: text.path.both + '/change-password', element: <UserChangePassword/>},
                        ]
                    }
                ]
            },
            {
                path: 'settings',
                children: [
                    {path: 'customize', element: <SettingCustomizePage />},
                ]
            }
        ]
    }
])
