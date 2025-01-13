export {
    getEnrolledStudents,
    searchEnrolledStudents,
    getStudentById,
    getRandomStudentClassmate,
    getAllStudentClassmate,
    countStudent
} from '../repository/studentRepository'

export {
    getClassesBasicValues
} from '../repository/classeRepository'

export {
    getCurrentAcademicYear
} from '../repository/academicYearRepository'

export {
    getEnrolledStudentsGuardians,
    getGuardianById,
    getGuardianWithStudentsById,
    getSearchedEnrolledStudentGuardian
} from '../repository/guardianRepository'

export {
    getAllStudentScores,
    getAllTeacherMarks,
    getAllStudentScoresBySubject,
    getAllAssignmentMarks
} from '../repository/scoreRepository'

export {
    getStudentAttendances,
    getAllStudentAttendances
} from '../repository/attendanceRepository.ts'

export {
    getAllTeachers,
    getSearchedTeachers,
    getTeacherById,
    getNumberOfStudentTaughtByTeacher,
    getNumberOfStudentTaughtByClasse,
    getTeacherSchedule,
    getTeacherScheduleByDay
} from '../repository/teacherRepository'

export {
    getAllBasicCourses
} from '../repository/courseRepository.ts'

export {
    getSomeStudentReprimandedByTeacher
} from '../repository/reprimandRepository.ts'

export {
    getSomeTeacherAssignments,
    getAllTeacherAssignments,
    getAllTeacherCourseAssignments
} from '../repository/assignmentRepository.ts'

export {
    getAllTeacherProgram, getAllTeacherCourseProgram
} from '../repository/courseProgramRepository.ts'









