import {useParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {fetchStudentById} from "../../data";
import {useDocumentTitle} from "../../hooks/useDocumentTitle.ts";
import {text} from "../../utils/text_display.ts";
import {setBreadcrumb} from "../../core/breadcrumb.tsx";
import {ReactNode, useEffect, useMemo, useState} from "react";
import {Student} from "../../entity";
import {getCountry, setFirstName} from "../../utils/utils.ts";
import PageHierarchy from "../../components/breadcrumb/PageHierarchy.tsx";
import ViewHeader from "../../components/ui/layout/ViewHeader.tsx";

const StudentView = () => {

    const { id } = useParams()

    const [student, setStudent] = useState<Student>({})

    const {data, isLoading, isSuccess, error, isError} = useQuery({
        queryKey: ['student-id'],
        queryFn: async () => await fetchStudentById(id as string).then(res => res.data)
    })

    useDocumentTitle({
        title: `EduSysPro - ${setFirstName(student.lastName)} ${setFirstName(student.firstName)}`,
        description: "Student description",
    })

    useEffect(() => {
        if (isSuccess && data) {
            setStudent(data)
        }
    }, [data, isSuccess]);

    const country = useMemo(async () => getCountry(student.nationality as string), [student.nationality] );

    const pageHierarchy = setBreadcrumb([
        {
            title: text.student.label,
            path: text.student.href
        },
        {
            title: `${setFirstName(student.lastName)} ${setFirstName(student.firstName)}`
        }
    ])

    console.log('country in student', student.nationality, 'country:', country)

    return(
        <>
            <PageHierarchy items={pageHierarchy as [{title: string | ReactNode, path?: string}]} mBottom={25} />
            <ViewHeader student={student} />
        </>
    )
}

export default StudentView