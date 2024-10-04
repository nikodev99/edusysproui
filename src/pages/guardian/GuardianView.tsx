import React from "react";
import {useFetch} from "../../hooks/useFetch.ts";
import {useParams} from "react-router-dom";
import {fetchGuardianWithStudents} from "../../data";

const GuardianView: React.FC = () => {

    const { id } = useParams();

    const {data} = useFetch(['guardian-id'], fetchGuardianWithStudents, [id])

    console.log("Guardian data: ", data?.students)

    return (
        <div>Guardian View</div>
    )
}

export default GuardianView