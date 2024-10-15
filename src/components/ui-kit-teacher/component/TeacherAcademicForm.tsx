import {useEffect, useMemo, useState} from "react";
import {Classe, Course} from "../../../entity";
import Responsive from "../../ui/layout/Responsive.tsx";
import {fetchAllCourses, findClassesBasicValue} from "../../../data";
import {Button, Flex, Form, List, Modal, Select} from "antd";
import {AiOutlinePlus} from "react-icons/ai";
import Grid from "../../ui/layout/Grid.tsx";
import {TeacherClassCourseSchema} from "../../../utils/interfaces.ts";
import {TeacherClassCourse} from "../../../entity/domain/TeacherClassCourse.ts";
import Tag from "../../ui/layout/Tag.tsx";
import {LuTrash2} from "react-icons/lu";
import LocalStorageManager from "../../../core/LocalStorageManager.ts";

const TeacherAcademicForm = ({onClose, reset}: {onClose: (finalArray: TeacherClassCourseSchema[]) => void, reset: boolean}) => {

    const [courses, setCourses] = useState<Course[]>([])
    const [classes, setClasses] = useState<Classe[]>([])
    const [isPending, setIsPending] = useState(false)
    const [open, setOpen] = useState<boolean>(false)
    const [selectedClass, setSelectedClass] = useState<number | null>(null);
    const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
    const [teacherClassCourses, setTeacherClassCourses] = useState<TeacherClassCourseSchema[]>((): TeacherClassCourseSchema[] => {
        const savedData = LocalStorageManager.get<TeacherClassCourseSchema[]>('teacherClassCourse')
        return savedData ? savedData : []
    });
    const [cours, setCours] = useState<Course>()
    const [classe, setClasse] = useState<Classe>()
    const [teacherUtils, setTeacherUtils] = useState<TeacherClassCourse[]>((): TeacherClassCourse[] => {
        const savedData = LocalStorageManager.get<TeacherClassCourse[]>('utilsClassCourse')
        return savedData ? savedData : []
    })

    useEffect(() => {
        if (teacherClassCourses) {
            LocalStorageManager.update('teacherClassCourse', () => teacherClassCourses)
        }
        if (teacherUtils) {
            LocalStorageManager.update('utilsClassCourse', () => teacherClassCourses)
        }
        if (reset) {
            LocalStorageManager.remove('teacherClassCourse')
            LocalStorageManager.remove('utilsClassCourse')
        }
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
    }, [isPending, reset, teacherClassCourses, teacherUtils]);

    const handleCancel = () => {
        setOpen(false);
    };

    const handleClassChange = (value: number) => {
        const classe = classes.find((c) => c.id === value);
        setSelectedClass(classe ? classe.id : null);
        setClasse(classe)
    };

    const handleCourseChange = (value: number) => {
        const course = courses.find((c) => c.id === value);
        setSelectedCourse(course ? course.id! : null);
        setCours(course)
    };

    const showLoading = (): void => {
        setOpen(true)
        setIsPending(true)
    }

    const courseOptions = useMemo(() => courses.map(c => ({
        value: c.id as number,
        label: `${c.course} - ${c.abbr}` as string
    })), [courses])

    const classeOptions = useMemo(() => classes.map(c => ({
        value: c.id,
        label: c.name,
    })), [classes])

    const addClassCourse = () => {
        if(selectedClass) {
            setTeacherClassCourses((prevState) => [
                ...prevState,
                {
                    classe: {id: selectedClass},
                    course: selectedCourse ? {id: selectedCourse}: undefined
                }
            ])
            setSelectedClass(null)
            setSelectedCourse(null)
            setTeacherUtils(prevState => [
                ...prevState,
                {
                    id: 0,
                    course: cours!,
                    classe: classe!
                }
            ])
        }
    }

    const removeClassCourse = (index: number) => {
        setTeacherUtils(prev => prev.filter((_, i) => i !== index));
        setTeacherClassCourses(prev => prev.filter((_, i) => i !== index));
    };

    const handleOk = () => {
        onClose(teacherClassCourses)
        setOpen(false)
    };

    return(
        <>
            <Flex justify='flex-end'>
                <Button onClick={showLoading} className='add__btn' icon={<AiOutlinePlus size={15} />}>
                    Ajouter classes et matières de l'enseignant
                </Button>
            </Flex>
            <List
                size="small"
                header={<div>Classes & Matières</div>}
                dataSource={teacherUtils}
                renderItem={(item, index) => (
                    <List.Item actions={[<Button type='link' onClick={() => removeClassCourse(index)}><LuTrash2 /></Button>]}>
                        Classe: <Tag color='danger'>{item.classe.name}</Tag> Cours: <Tag color='warning'>{item.course?.course || "N/A"}</Tag>
                    </List.Item>
                )}
            />
            <Modal
                open={open}
                loading={isPending}
                title='Ajouter Classes & Matières'
                onCancel={handleCancel}
                onOk={handleOk}
                width={800}
            >
                <Responsive gutter={[16, 16]}>
                    <Grid xs={24} md={12} lg={12} xxl={12}>
                        <Form.Item label='Classes' required layout='vertical'>
                            <Select
                                placeholder='Selectionne les classes'
                                options={classeOptions}
                                onChange={handleClassChange}
                            />
                        </Form.Item>
                    </Grid>
                    <Grid xs={24} md={12} lg={12} xxl={12}>
                        <Form.Item label='Matières' layout='vertical'>
                            <Select
                                placeholder='Selectionner les matières'
                                options={courseOptions}
                                onChange={handleCourseChange}
                            />
                        </Form.Item>
                    </Grid>
                </Responsive>
                <Form.Item>
                    <Button className='add__btn' onClick={addClassCourse} disabled={!selectedClass}>
                        Ajouter
                    </Button>
                </Form.Item>
                <Form.Item>
                    <List
                        size="small"
                        header={<div>Classes & Matières</div>}
                        dataSource={teacherUtils}
                        renderItem={(item, index) => (
                            <List.Item actions={[<Button type='link' onClick={() => removeClassCourse(index)}><LuTrash2 /></Button>]}>
                                Classe: <Tag color='danger'>{item.classe.name}</Tag> Cours: <Tag color='warning'>{item.course?.course || "N/A"}</Tag>
                            </List.Item>
                        )}
                    />
                </Form.Item>
            </Modal>
        </>
    )
}

export { TeacherAcademicForm }