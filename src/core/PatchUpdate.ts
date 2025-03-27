import {updateStudent} from "../data";
import {Individual} from "../entity/domain/individual.ts";
import {UpdateType} from "./shared/sharedEnums.ts";
import {ID} from "./utils/interfaces.ts";

export class PatchUpdate {

    static async set<T, Q> (
        field: keyof T | keyof Individual,
        value: Q,
        infoID: ID,
        setSuccessMessage: (msg?: string) => void,
        setErrorMessage: (msg?: string) => void,
        updateType?: UpdateType
    ) {
        await updateStudent(field as keyof Individual, value[field as keyof Q], infoID, updateType)
            .then(({isSuccess, success, error}) => {
                if (isSuccess) {
                    setSuccessMessage(success)
                }else {
                    setErrorMessage(error)
                }
            })
            .catch((err) => {
                setErrorMessage(`An unexpected error occurred: ${err.error.message}`);
            })
    }

    static async address<T> (
        field: keyof T,
        value: T,
        addressId: ID,
        setSuccessMessage: (msg?: string) => void,
        setErrorMessage: (msg?: string) => void
    ) {
        await PatchUpdate.set(field, value, addressId, setSuccessMessage, setErrorMessage, UpdateType.ADDRESS)
    }
}