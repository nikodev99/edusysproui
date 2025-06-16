import {useEffect, useMemo, useState} from "react";
import {Course} from "../../../entity";
import Responsive from "../../ui/layout/Responsive.tsx";
import {fetchAllCourses} from "../../../data";
import {Form, Select} from "antd";
import Grid from "../../ui/layout/Grid.tsx";
import {SelectClasse} from "../../common/SelectClasse.tsx";

const TeacherAcademicForm = ({onClose, defaultClasses, defaultCourses}: {
    onClose: ({courses, classes}: {courses?: {id: number}[], classes?: {id: number}[]}) => void,
    defaultClasses?: number[]
    defaultCourses?: number[]
}) => {

    const [courses, setCourses] = useState<Course[]>([])
    const [selectedClasse, setSelectedClasse] = useState<number[]>()
    const [selectedCourse, setSelectedCourse] = useState<number[]>([])
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

    console.log('SELECTED CLASSE: ', selectedClasse)

    return(
        <>
            <Responsive gutter={[16, 16]}>
                <Grid xs={24} md={12} lg={12} xxl={12}>
                    <Form.Item label='Classes' required layout='vertical'>
                        <SelectClasse
                            getClasse={handleClassChange as () => void}
                            placeholder='Selectionne les classes'
                            isLoading={isPending}
                            defaultValue={defaultClasses}
                            variant={'outlined'}
                            multiple
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