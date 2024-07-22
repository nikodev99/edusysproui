import {Flex} from "antd";
import {Student} from "../../../entity";
import Avatar from "./Avatar.tsx";

interface ViewProps {
    student: Student
}

const ViewHeader = ({student}: ViewProps) => {
    return(
        <Flex align='center' justify='space-between' component='header'>
            <Flex className="avatar-container" align='center' gap={10}>
                <Avatar image={student.image} firstText={student.firstName} lastText={student.lastName} size={60} />
                <Flex className="legal" vertical>
                    <span className='title'>{`${student.lastName} ${student.firstName}`}</span>
                    <span className='mention'>Représentant légal</span>
                </Flex>
            </Flex>
        </Flex>
    )
}

export default ViewHeader