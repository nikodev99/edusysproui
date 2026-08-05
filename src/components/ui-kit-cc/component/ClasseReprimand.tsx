import {Classe} from "@/entity";
import {InfoPageProps} from "@/core/utils/interfaces.ts";
import {useReprimandRepo} from "@/hooks/actions/useReprimandRepo.ts";
import {ReprimandList} from "@/components/common/ReprimandList.tsx";

export function ClasseReprimand({infoData, academicYear}: InfoPageProps<Classe>) {
    const {useGetClasseReprimands} = useReprimandRepo()

    const {fetchReprimands} = useGetClasseReprimands(infoData?.id)

    return(
        <ReprimandList
            callback={fetchReprimands as () => never}
            dataId={infoData?.id}
            academicYear={academicYear}
            isClasse
        />
    )
}