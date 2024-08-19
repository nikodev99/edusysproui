import {Button, Dropdown, Flex, Skeleton} from "antd";
import {Enrollment} from "../../../entity";
import Avatar from "./Avatar.tsx";
import {LuChevronDown, LuPencil, LuTrash, LuUserCircle, LuUserPlus} from "react-icons/lu";
import {setFirstName} from "../../../utils/utils.ts";

interface ViewProps {
    enrollment: Enrollment | null,
    isLoading: boolean,
}

const ViewHeader = ({enrollment, isLoading}: ViewProps) => {

    if (enrollment == null) {
        return (
            <Skeleton loading={isLoading} active={isLoading} avatar paragraph={{rows: 2}} />
        )
    }

    const {student, student: {guardian}, isArchive, classe, classe: {grade} } = enrollment!

    return(
        <Flex align='center' justify='space-between' component='header' className='view__block'>
            <Flex className="avatar-container" align='center' gap={10}>
                <Avatar image={student?.image} firstText={student?.firstName} lastText={student?.lastName} size={60} />
                <Flex className="legal" vertical justify='center'>
                    <span className='title'>{setFirstName(`${student?.lastName} ${student?.firstName}`)}</span>
                    <span className='mention'>{student?.reference}</span>
                </Flex>
            </Flex>
            <Flex className='block' align='flex-start' vertical gap={4}>
                <p>Tuteur Légal</p>
                <p>{setFirstName(`${guardian?.lastName} ${guardian?.firstName}`)}</p>
            </Flex>
            {
                !isArchive ? (<Flex className='block' align='flex-start' vertical gap={4}>
                    <p>{classe?.name}</p>
                    <p>{grade?.section}</p>
                </Flex>): (<Flex className='block' align='flex-start' vertical gap={4}>
                    <p>Tuteur téléphone</p>
                    <p>{guardian?.telephone}</p>
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