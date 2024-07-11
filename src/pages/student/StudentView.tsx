import {useParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {fetchStudentById} from "../../data";

const StudentView = () => {

    const { id } = useParams()

    const {data, isLoading, isSuccess, error, isError} = useQuery({
        queryKey: ['student-id'],
        queryFn: async () => await fetchStudentById(id as string)
    })

    console.log(data)

    return(
        <div></div>
    )
}

export default StudentView