import {Button, Dropdown, Flex} from "antd";
import {Student} from "../../../entity";
import Avatar from "./Avatar.tsx";
import {LuChevronDown} from "react-icons/lu";

interface ViewProps {
    student: Student
}

const ViewHeader = ({student}: ViewProps) => {
    return(
        <Flex align='center' justify='space-between' component='header' className='view__block'>
            <Flex className="avatar-container" align='center' gap={10}>
                <Avatar image={student.image} firstText={student.firstName} lastText={student.lastName} size={60} />
                <Flex className="legal" vertical justify='center'>
                    <span className='title'>{`${student.lastName} ${student.firstName}`}</span>
                    <span className='mention'>Étudiant</span>
                </Flex>
            </Flex>
            <Flex className='block' align='flex-start' vertical>
                <p>Tuteur Légal</p>
                <p>{`${student.guardian?.lastName} ${student.guardian?.firstName}`}</p>
            </Flex>
            <Flex className='block' align='flex-start' vertical>
                <p>Nationality</p>
                <p>{`${student.guardian?.telephone}`}</p>
            </Flex>
            <Flex className='block' align='flex-start' vertical>
                <Dropdown menu={{items: [
                        {key: 1, label: 'Editer'},
                        {key: 1, label: 'Tuteur légal'},
                    ]}} trigger={['click']}>
                    <Button type='primary' className='add__btn'>Gérer <LuChevronDown size={18} /></Button>
                </Dropdown>
            </Flex>
        </Flex>
    )
}

export default ViewHeader