import {useMemo, useState} from "react";
import Responsive from "@/components/ui/layout/Responsive.tsx";
import {Form, Select} from "antd";
import Grid from "@/components/ui/layout/Grid.tsx";
import {useCourseRepo} from "@/hooks/actions/useCourseRepo.ts";
import {useClasseRepo} from "@/hooks/actions/useClasseRepo.ts";

const TeacherAcademicForm = ({onClose, defaultClasses, defaultCourses}: {
    onClose: ({courses, classes}: {courses?: {id: number}[], classes?: {id: number}[]}) => void,
    defaultClasses?: number[]
    defaultCourses?: number[]
}) => {

    const [selectedClasse, setSelectedClasse] = useState<number[]>()
    const [selectedCourse, setSelectedCourse] = useState<number[]>([])
    const {useGetBasicCourses} = useCourseRepo()
    const {useGetClasseBasicValues} = useClasseRepo()

    const courses = useGetBasicCourses()
    const classes = useGetClasseBasicValues()

    const handleClassChange = (value: number[]) => {
        setSelectedClasse(value)
        onClose({
            classes: value?.map(id => ({id})),
            courses: selectedCourse ? selectedCourse?.map(id => ({id})) : undefined
        })
    };

    const handleCourseChange = (value: number[]) => {
        setSelectedCourse(value ? value : [])
        onClose({
            classes: selectedClasse?.map(id => ({id})),
            courses: value ? value.map(id => ({id})) : undefined,
        })
    };

    const courseOptions = useMemo(() => courses.map(c => ({
        value: c.id as number,
        label: `${c.course} - ${c.abbr}` as string
    })), [courses])
    
    const classeOptions = useMemo(() => classes?.map(c => ({
        value: c?.id,
        label: c?.name
    })), [classes])

    return(
        <>
            <Responsive gutter={[16, 16]}>
                <Grid xs={24} md={12} lg={12} xxl={12}>
                    <Form.Item label='Classes' required layout='vertical'>
                        <Select
                            onChange={handleClassChange as () => void}
                            placeholder='Selectionne les classes'
                            defaultValue={defaultClasses}
                            mode={'multiple'}
                            options={classeOptions}
                        />
                    </Form.Item>
                </Grid>
                <Grid xs={24} md={12} lg={12} xxl={12}>
                    <Form.Item label='Matières' layout='vertical'>
                        <Select
                            placeholder='Selectionner les matières'
                            options={courseOptions}
                            onChange={handleCourseChange}
                            mode='multiple'
                            defaultValue={defaultCourses}
                        />
                    </Form.Item>
                </Grid>
            </Responsive>
        </>
    )
}

export { TeacherAcademicForm }