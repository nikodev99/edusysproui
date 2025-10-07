import {Individual} from "../entity";
import {UpdateType} from "./shared/sharedEnums.ts";
import {ID} from "./utils/interfaces.ts";
import {patchContext} from "../data/repository/patchContext.ts";
import {AxiosResponse} from "axios";
import {saveUserActivity} from "../data/repository/userRepository.ts";
import {UserActivity} from "../auth/dto/user.ts";

export class PatchUpdate {
    static async setWithCustom(
        updateMethod: (...params: unknown[]) =>  Promise<AxiosResponse<string>>,
        setSuccessMessage: (msg?: string) => void,
        setErrorMessage: (msg?: string) => void,
        params: unknown[] = [],
        activity?: UserActivity
    ) {
        await updateMethod(...params).then(resp => {
            if (resp.status === 200) {
                setSuccessMessage()
                if (activity) {
                    saveUserActivity({
                        action: activity?.action,
                        accountId: activity?.accountId,
                        description: activity?.description
                    })
                }
            }else {
                setErrorMessage(String(resp.status))
            }
        }).catch((err) => {
            setErrorMessage(`An unexpected error occurred: ${err.error.message}`)
        })
    }

    static async set<T, Q> (
        field: keyof T | keyof Individual,
        value: Q,
        infoID: ID,
        setSuccessMessage: (msg?: string) => void,
        setErrorMessage: (msg?: string) => void,
        updateType?: UpdateType
    ) {
        const fieldSegment = typeof field === 'string' && field.includes('.')
            ? field.split('.')
            : [field]

        let nestedValue = value[field as keyof Q];
        if (fieldSegment.length > 1) {
            const nestedField = fieldSegment[0] === 'classeEntity' ? 'classe' : fieldSegment[0]
            nestedValue = value[nestedField as never][fieldSegment[1] as keyof Q]
        }

        await patchContext.patch(
            field as keyof T,
            nestedValue,
            infoID,
            updateType
        )
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