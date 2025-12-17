import {Filter} from "../common/Filter.tsx";
import {AssignmentFilterProps} from "../../data/repository/assignmentRepository.ts";
import {text} from "../../core/utils/text_display.ts";
import {ItemType} from "antd/es/menu/interface";
import {useMemo, useState} from "react";
import {useGradeRepo} from "../../hooks/actions/useGradeRepo.ts";
import {useCourseRepo} from "../../hooks/actions/useCourseRepo.ts";
//import {useSemesterRepo} from "../../../hooks/useSemesterRepo.ts";
import {useClasseRepo} from "../../hooks/actions/useClasseRepo.ts";
import {FilterType, useFilter} from "../../hooks/useFilter.ts";
import {Options} from "../../core/utils/interfaces.ts";

export const AssignmentFilter = (
    {academicYear, academicYearOptions, setFilters: emitFilters}: FilterType<AssignmentFilterProps>
) => {

    //const [semesters, setSemesters] = useState<Semester[]>([])
    const [filterItem, setFilterItem] = useState<AssignmentFilterProps>({academicYearId: academicYear} as AssignmentFilterProps)
    const {useGetAllGrades} = useGradeRepo()
    const {useGetClasseBasicValues} = useClasseRepo()
    const {useGetBasicCourses} = useCourseRepo()
    //const {useGetAllSemesters} = useSemesterRepo()
    
    const fetchedGrades = useGetAllGrades()
    const fetchedCourses = useGetBasicCourses()
    //const fetchedSemesters = useGetAllSemesters()
    const fetchedClasses = useGetClasseBasicValues()

    const grades = useMemo(() => fetchedGrades ?? [], [fetchedGrades])
    const classes = useMemo(() => fetchedClasses ?? [], [fetchedClasses])
    const courses = useMemo(() => fetchedCourses ?? [], [fetchedCourses])

    const {makeOnChange, handleUpdateFilters, handleClear, getOptions} = useFilter(setFilterItem, emitFilters)
    
    const options = useMemo(
        () =>
            ({
                academicYearId: academicYearOptions,
                gradeId:    getOptions(grades,    "id", "section"),
                classeId:   getOptions(classes,   "id",  "name"),
                courseId:   getOptions(courses,   "id",  "course"),
                //TODO Adding the filter by semester
                //semesterId: getOptions(semesters, "semesterId", "semesterName"),
            } as Record<keyof AssignmentFilterProps, Options>),
        [academicYearOptions, getOptions, grades, classes, courses]
    );

    const onChanges = useMemo(
        () =>
            ({
                academicYearId: makeOnChange("academicYearId"),
                gradeId:        makeOnChange("gradeId"),
                classeId:       makeOnChange("classeId"),
                courseId:       makeOnChange("courseId"),
                semesterId:     makeOnChange("semesterId"),
            } as Record<keyof AssignmentFilterProps, (v: unknown) => void>),
        [emitFilters]
    );

    const items: ItemType[] = [
        {key: '2', label: 'Grade', onClick: () => handleUpdateFilters('gradeId')},
        {key: '3', label: 'Classe', onClick: () => handleUpdateFilters('classeId')},
        {key: '4', label: 'Matière', onClick: () => handleUpdateFilters('courseId')},
        {key: '5', label: text.semester, onClick: () => handleUpdateFilters('semesterId')}
    ]

    return (
        <Filter
            filters={filterItem}
            items={items}
            onClear={handleClear}
            options={options}
            onChanges={onChanges}
        />
    )
}