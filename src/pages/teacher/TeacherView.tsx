import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Teacher} from "../../entity";
import {useFetch} from "../../hooks/useFetch.ts";
import {setFirstName} from "../../utils/utils.ts";
import {fetchTeacherById} from "../../data";

const TeacherView = () => {

    const { id } = useParams()

    const [teacher, setTeacher] = useState<Teacher | null>(null)
    
    const {data, isSuccess} = useFetch(['student-id', id!], fetchTeacherById, [id])

    const teacherLastName = teacher?.maidenName ? `${teacher?.lastName} née ${teacher?.maidenName}` : teacher?.lastName
    const teacherFullName = teacher ? setFirstName(`${teacherLastName} ${teacher.firstName}`) : 'Enseignant'
    
    useEffect(() => {
        if (isSuccess && data) {
            setTeacher(data)
        }
    }, [isSuccess, data])
    
    return(
        <div>{teacherFullName}</div>
    )
}

export default TeacherView;