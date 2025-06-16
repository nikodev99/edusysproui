import {SelectEntityProps} from "../../core/utils/interfaces.ts";
import {Classe} from "../../entity";
import {useClasseRepo} from "../../hooks/useClasseRepo.ts";
import {CustomEntitySelect} from "../custom/CustomEntitySelect.tsx";

type SelectClassesProps = {
    getClasse: (value: number | number[]) => void
    defaultClasses?: Classe[]
} & SelectEntityProps<Classe, number | number[]>

export const SelectClasse = (
    {getClasse, defaultClasses, isLoading, defaultValue, placeholder, multiple, onlyCurrent, variant}: SelectClassesProps
) => {

    const {useGetClasseBasicValues} = useClasseRepo()
    const classes = useGetClasseBasicValues()

    const handleClasseChange = (value: number | number[]) => {
        getClasse(value)
    }

    return(
        <CustomEntitySelect
            data={classes}
            entities={defaultClasses}
            getEntity={handleClasseChange}
            options={{id: 'id', label: 'name'}}
            uniqueValue={{key: 'id', value: defaultValue as number | number[]}}
            multiple={multiple}
            isLoading={isLoading}
            placeholder={placeholder}
            variant={variant}
            onlyCurrent={onlyCurrent as number}
            width={'100%'}
        />
    )
}