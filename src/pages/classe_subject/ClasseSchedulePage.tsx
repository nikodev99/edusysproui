import {ManageClasseSchedules} from "@/components/ui-kit-cc";
import {useParams} from "react-router-dom";
import {useClasseRepo} from "@/hooks/actions/useClasseRepo.ts";

const ClasseSchedulePage = () => {
    const {id} = useParams()
    const {useGetClasse} = useClasseRepo()
    const {data: classe} = useGetClasse(Number(id), '', true)

    return <ManageClasseSchedules classe={classe} />
}

export default ClasseSchedulePage