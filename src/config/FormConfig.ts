import {FormUtils} from "../core/utils/formUtils.ts";
import {FieldErrors, FieldValues, Path} from "react-hook-form";

export class FormConfig<T extends FieldValues | FieldErrors> {

    private readonly error_type: FieldErrors<T>
    private readonly toEdited: boolean = false;
    private readonly onEnroll: boolean = false;

    constructor(error_type: FieldErrors<T>, toEdited: boolean = false, onEnroll: boolean = false) {
        this.error_type = error_type;
        this.toEdited = toEdited;
        this.onEnroll = onEnroll;
    }

    name(fieldName: keyof T, parent?: string): Path<T> {
        return FormUtils.setName(fieldName, this.toEdited as boolean, parent, this.onEnroll) as Path<T>
    }

    validate(fieldName: keyof T, parent?: string): 'error' {
        return FormUtils.getValidationStatus(fieldName, this.error_type, this.toEdited as boolean, parent, this.onEnroll) as 'error'
    }

    error(fieldName: keyof T, parent?: string) {
        return FormUtils.getErrorMessage(fieldName, this.error_type, this.toEdited as boolean, parent, this.onEnroll)
    }
}