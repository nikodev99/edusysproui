import {useEffect, useMemo, useState} from "react";
import {Classe, Course} from "../../../entity";
import Responsive from "../../ui/layout/Responsive.tsx";
import {fetchAllCourses, findClassesBasicValue} from "../../../data";
import {Form, Select} from "antd";
import Grid from "../../ui/layout/Grid.tsx";

const TeacherAcademicForm = ({onClose, defaultClasses, defaultCourses}: {
    onClose: ({courses, classes}: {courses?: {id: number}[], classes?: {id: number}[]}) => void,
    defaultClasses?: number[]
    defaultCourses?: number[]
}) => {

    const [courses, setCourses] = useState<Course[]>([])
    const [classes, setClasses] = useState<Classe[]>([])
    const [selectedClasse, setSelectedClasse] = useState<number[]>()
    const [selectedCourse, setSelectedCourse] = useState<number[] | undefined>(undefined)
    const [isPending, setIsPending] = useState(false)

    useEffect(() => {
        const fetchedData = async () => {
            let loading: undefined | boolean
            await fetchAllCourses()
                .then(resp => {
                    if (resp.isSuccess) {
                        setCourses(resp.data as Course[])
                        loading = resp.isLoading
                    }
                })

            await findClassesBasicValue()
                .then((resp) => {
                    if (resp.isSuccess && 'data' in resp) {
                        setClasses(resp.data as Classe[])
                        loading = resp.isLoading
                    }
                })
            setIsPending(loading ? loading : false)
        }
        fetchedData().catch(e => console.error(e.message))
    }, [isPending]);

    const handleClassChange = (value: number[]) => {
        setSelectedClasse(value)
        onClose({
            classes: value?.map(id => ({id})),
            courses: selectedCourse ? selectedCourse?.map(id => ({id})) : undefined
        })
    };

    const handleCourseChange = (value: number[]) => {
        setSelectedCourse(value ? value : undefined)
        onClose({
            classes: selectedClasse?.map(id => ({id})),
            courses: value ? value.map(id => ({id})) : undefined,
        })
    };

    const courseOptions = useMemo(() => courses.map(c => ({
        value: c.id as number,
        label: `${c.course} - ${c.abbr}` as string
    })), [courses])

    const classeOptions = useMemo(() => classes.map(c => ({
        value: c.id,
        label: c.name,
    })), [classes])

    return(
        <>
            <Responsive gutter={[16, 16]}>
                <Grid xs={24} md={12} lg={12} xxl={12}>
                    <Form.Item label='Classes' required layout='vertical'>
                        <Select
                            placeholder='Selectionne les classes'
                            options={classeOptions}
                            onChange={handleClassChange}
                            mode='multiple'
                            loading={isPending}
                            value={defaultClasses}
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
                            loading={isPending}
                            value={defaultCourses}
                        />
                    </Form.Item>
                </Grid>
            </Responsive>
        </>
    )
}

export { TeacherAcademicForm }