import {Button, Dropdown, Flex} from "antd";
import {Student} from "../../../entity";
import Avatar from "./Avatar.tsx";
import {LuChevronDown, LuPencil, LuTrash, LuUserCircle, LuUserCog, LuUserPlus} from "react-icons/lu";
import {useMemo} from "react";
import {getCountry, setFirstName} from "../../../utils/utils.ts";

interface ViewProps {
    student: Student
}

const ViewHeader = ({student}: ViewProps) => {

    //const country = useMemo( () => getCountry(student.nationality as string), [student.nationality] );
    const enrollment = student.enrollments?.find(e => !e.isArchive)

    console.log('Enrollment: ', student)

    return(
        <Flex align='center' justify='space-between' component='header' className='view__block'>
            <Flex className="avatar-container" align='center' gap={10}>
                <Avatar image={student.image} firstText={student.firstName} lastText={student.lastName} size={60} />
                <Flex className="legal" vertical justify='center'>
                    <span className='title'>{setFirstName(`${student.lastName} ${student.firstName}`)}</span>
                    <span className='mention'>Étudiant</span>
                </Flex>
            </Flex>
            <Flex className='block' align='flex-start' vertical gap={4}>
                <p>Tuteur Légal</p>
                <p>{setFirstName(`${student.guardian?.lastName} ${student.guardian?.firstName}`)}</p>
            </Flex>
            {
                enrollment ? (<Flex className='block' align='flex-start' vertical gap={4}>
                    <p>Classe</p>
                    <p>{enrollment?.classe?.name}</p>
                </Flex>): (<Flex className='block' align='flex-start' vertical gap={4}>
                    <p>Tuteur téléphone</p>
                    <p>{student.guardian?.telephone}</p>
                </Flex>)
            }

            <Flex className='block' align='flex-start' vertical gap={4}>
                <Dropdown menu={{items: [
                        {key: 1, label: 'Editer', icon: <LuPencil />},
                        {key: 2, label: 'Tuteur légal', icon: <LuUserCircle />},
                        {key: 3, label: 'Réinscrire', icon: <LuUserPlus />},
                        {key: 4, label: 'Retirer l\'étudiant', danger: true, icon: <LuTrash />}
                    ]}} trigger={['click']}>
                    <Button type='primary' className='add__btn'>Gérer <LuChevronDown size={18} /></Button>
                </Dropdown>
            </Flex>
        </Flex>
    )
}

export default ViewHeader