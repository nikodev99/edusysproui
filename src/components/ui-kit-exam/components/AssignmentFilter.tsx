import {Filter} from "../../common/Filter.tsx";
import {AssignmentFilterProps} from "../../../data/repository/assignmentRepository.ts";
import {text} from "../../../core/utils/text_display.ts";
import {ItemType} from "antd/es/menu/interface";
import {useCallback, useEffect, useMemo, useState} from "react";
import {useGradeRepo} from "../../../hooks/useGradeRepo.ts";
import {Classe, Course, Grade, Semester} from "../../../entity";
import {useClasse} from "../../../hooks/useClasse.tsx";
import {useCourseRepo} from "../../../hooks/useCourseRepo.ts";
import {useSemesterRepo} from "../../../hooks/useSemesterRepo.ts";

type FilterType = {
    setFilters: (filters: AssignmentFilterProps) => void,
    academicYear?: string,
    academicYearOptions?: Option[]
    academicYearChangeFunc?: (value: string) => void
}
type Option = { label: string; value: unknown }

const getOptions = <T extends object>(data: T[], value: keyof T, label: keyof T): Option[] => {
    const mappedData = data?.map(d => ({
        value: d[value] as unknown,
        label: d[label] as string
    })) || [];

    return [{value: 0, label: 'TOUS'}, ...mappedData];
}

export const AssignmentFilter = (
    {academicYear, academicYearOptions, setFilters: emitFilters}: FilterType
) => {

    const [grades, setGrades] = useState<Grade[]>([])
    const [classes, setClasses] = useState<Classe[]>([])
    const [courses, setCourses] = useState<Course[]>([])
    const [semesters, setSemesters] = useState<Semester[]>([])
    const [filterItem, setFilterItem] = useState<AssignmentFilterProps>({academicYearId: academicYear} as AssignmentFilterProps)
    const {useGetAllGrades} = useGradeRepo()
    const {classes: allClasses} = useClasse()
    const {useGetBasicCourses} = useCourseRepo()
    const {useGetAllSemesters} = useSemesterRepo()
    
    const fetchedGrades = useGetAllGrades()
    const fetchedCourses = useGetBasicCourses()
    const fetchedSemesters = useGetAllSemesters()

    const options = useMemo(
        () =>
            ({
                academicYearId: academicYearOptions,
                gradeId:    getOptions(grades,    "id", "section"),
                classeId:   getOptions(classes,   "id",  "name"),
                courseId:   getOptions(courses,   "id",  "course"),
                semesterId: getOptions(semesters, "semesterId", "semesterName"),
            } as Record<keyof AssignmentFilterProps, Option[]>),
        [academicYearOptions, grades, classes, courses, semesters]
    );

    const makeOnChange =
        (key: keyof AssignmentFilterProps) =>
            (value: unknown) => {
                setFilterItem((prev) => {
                    const next = { ...prev, [key]: value as number };
                    emitFilters(next);
                    return next;
                });
            };

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

    useEffect(() => {
        if (fetchedGrades) setGrades(fetchedGrades as Grade[]);
        if (allClasses) setClasses(allClasses);
        if (fetchedCourses) setCourses(fetchedCourses as Course[]);
        if (fetchedSemesters) setSemesters(fetchedSemesters as Semester[]);
    }, [allClasses, fetchedCourses, fetchedGrades, fetchedSemesters]);

    console.log('Options: ', options)
    console.log('Changes: ', onChanges)
    console.log('FILTER DANS ASSIGNMENT FILTER: ', filterItem)

    const handleUpdateFilters = (key: keyof AssignmentFilterProps) => setFilterItem((prev) => {
        const next = { ...prev, [key]: 0 };
        emitFilters(next);
        return next;
    })

    const items: ItemType[] = [
        {key: '2', label: 'Grade', onClick: () => handleUpdateFilters('gradeId')},
        {key: '3', label: 'Classe', onClick: () => handleUpdateFilters('classeId')},
        {key: '4', label: 'Matière', onClick: () => handleUpdateFilters('courseId')},
        {key: '5', label: text.semester, onClick: () => handleUpdateFilters('semesterId')}
    ]

    const handleClear = useCallback(
        (key: keyof AssignmentFilterProps) => {
            setFilterItem((prev) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { [key]: _, ...rest } = prev;
                const next = rest as AssignmentFilterProps;
                emitFilters(next);
                return next;
            });
        },
        [emitFilters]
    );

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