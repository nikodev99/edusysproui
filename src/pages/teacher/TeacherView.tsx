import {useParams} from "react-router-dom";
import {ReactNode, useEffect, useLayoutEffect, useState} from "react";
import {Teacher} from "../../entity";
import {useFetch} from "../../hooks/useFetch.ts";
import {chooseColor, setLastName, setName} from "../../utils/utils.ts";
import {count, countStudents, fetchTeacherById} from "../../data";
import {useDocumentTitle} from "../../hooks/useDocumentTitle.ts";
import PageHierarchy from "../../components/breadcrumb/PageHierarchy.tsx";
import {text} from "../../utils/text_display.ts";
import {setBreadcrumb} from "../../core/breadcrumb.tsx";
import {Widgets} from "../../components/ui/layout/Widgets.tsx";
import {WidgetItem} from "../../utils/interfaces.ts";
import {Progress, Tag} from "antd";
import ViewHeader from "../../components/ui/layout/ViewHeader.tsx";
import {getStatusKey, Status} from "../../entity/enums/status.ts";
import {Gender} from "../../entity/enums/gender.ts";
import {LuClipboardEdit, LuListChecks, LuSubtitles, LuTrash2, LuUserMinus} from "react-icons/lu";
import {TeacherEditDrawer} from "../../components/ui-kit-teacher";
import {useToggle} from "../../hooks/useToggle.ts";
import {FcLibrary} from "react-icons/fc";
import {AiOutlineArrowUp} from "react-icons/ai";

const TeacherView = () => {

    const { id } = useParams()

    const [teacher, setTeacher] = useState<Teacher | null>(null)
    const [studentTaughtCount, setStudentTaughtCount] = useState<number>(0)
    const [studentCount, setStudentCount] = useState<number>(0)
    const [openDrawer, setOpenDrawer] = useToggle(false)

    const {data, isLoading, isSuccess, refetch} = useFetch(['student-id', id!], fetchTeacherById, [id])

    const teacherName = setName(teacher?.lastName, teacher?.firstName)
    const color: string = teacher?.firstName ? chooseColor(teacher.firstName) as string  : '#7615c4'

    useDocumentTitle({
        title: teacherName,
        description: 'Teacher description',
    })

    useEffect(() => {
        if (isSuccess && data) {
            setTeacher(data)
        }
    }, [isSuccess, data])

    useLayoutEffect(() => {
        if (teacher?.id) {
            count(teacher.id).then((resp) => {
                if (resp.isSuccess && 'data' in resp) {
                    setStudentTaughtCount(resp.data ? resp?.data.count : 0);
                }
            });
            countStudents().then((resp) => {
                if (resp.isSuccess && 'data' in resp) {
                    setStudentCount(resp.data ? resp?.data.count : 0);
                }
            })
        }
    }, [teacher]);

    const widgetItems: WidgetItem[] = [
        {
            title: 'Classes',
            value: teacher?.classes ? teacher?.classes.length : 0,
            prefix: <AiOutlineArrowUp />
        },
        {
            title: 'Etudiants enseignés',
            value: studentTaughtCount,
            bottomValue: <Progress
                percent={Math.round((studentTaughtCount * 100) / studentCount)}
                size={[288, 20]}
                percentPosition={{align: 'center', type: 'inner'}}
                strokeColor={color}
            />
        },
        {
            title: 'Commentaires',
            value: '',
        },
        {
            title: 'Etudiants blamés',
            value: '',
        }
    ]

    const handleCloseDrawer = () => {
        setOpenDrawer()
        refetch().then(r => r.data)
    }

    console.log(teacher)

    return(
        <>
            <PageHierarchy mBottom={25} items={setBreadcrumb([
                {title: text.teacher.label + 's', path: text.teacher.href},
                {title: teacherName}
            ]) as [{ title: string | ReactNode, path?: string }]}/>
            <ViewHeader
                isLoading={isLoading}
                setEdit={setOpenDrawer}
                closeState={openDrawer}
                avatarProps={{
                    image: teacher?.image,
                    firstName: teacher?.firstName,
                    lastName: setLastName(teacher?.lastName, teacher?.maidenName),
                    reference: teacher?.emailId
                }}
                blockProps={[
                    {
                        title: 'Etat Civil',
                        mention: <Tag
                            color={color}>{getStatusKey(teacher?.status as Status, teacher?.gender === Gender.FEMME)}</Tag>
                    },
                    {title: 'Télephone', mention: teacher?.telephone},
                ]}
                items={[
                    {key: 2, label: 'Ajouter programme', icon: <LuListChecks/>},
                    {key: 3, label: 'Créer examen', icon: <LuClipboardEdit/>},
                    {key: 4, label: 'Créer punition', icon: <LuUserMinus/>},
                    {key: 5, label: 'Créer commentaire', icon: <LuSubtitles/>},
                    {key: 6, label: 'Retirer l\'enseignant', danger: true, icon: <LuTrash2/>}
                ]}
            />
            <Widgets items={widgetItems}/>
            <section>
                <TeacherEditDrawer
                    open={openDrawer}
                    close={handleCloseDrawer}
                    isLoading={isLoading}
                    data={teacher ? teacher : {} as Teacher}
                />
            </section>
        </>
    )
}

export default TeacherView;