import {FieldErrors, FieldValues} from "react-hook-form";
import {ReactNode} from "react";

class FormUtils {
    static onlyField(toEdit: boolean, editScreen: number, actualScreen: number | undefined) {
        return toEdit ? editScreen : actualScreen;
    }

    static getValidationStatus<T extends FieldErrors>(fieldName: keyof T, errors: FieldErrors<T>, toEdit: boolean, parent?: string, enroll?: boolean) {
        if (toEdit) {
            return errors?.[fieldName as string] ? 'error' : '';
        } else {
            if (enroll) {
                return FormUtils.getNestedErrorValidationStatus(fieldName as string, errors, parent)
            }else {
                return FormUtils.setValidation(fieldName as string, errors, parent);
            }
        }
    }

    static getErrorMessage<T extends FieldErrors>(fieldName: keyof T, errors: FieldErrors<T>, toEdit: boolean, parent?: string, enroll?: boolean): ReactNode {
        console.log({fieldName, errors, toEdit, parent, enroll});
        if (toEdit) {
            return (errors?.[fieldName]?.message || '') as ReactNode
        } else {
            if (enroll) {
                return FormUtils.getNestedError(fieldName as string, errors, parent) || ''
            }else {
                return FormUtils.setError(fieldName as string, errors, parent);
            }
        }
    }

    static setName <T extends FieldValues>(fieldName: keyof T, toEdit: boolean, parent?: string, enroll?: boolean) {
        if (toEdit) {
            return String(fieldName)
        }else {
            if (enroll) {
                return parent ? `${parent}.${String(fieldName)}` : String(fieldName)
            }
            return parent ? `${FormUtils.getOnlyParent(parent)}.${String(fieldName)}` : String(fieldName)
        }
    }

    private static getNestedError<T extends FieldErrors>(fieldName: keyof T, errors: FieldErrors<T>, parent?: string): ReactNode {
        let nestedErrors = errors
        if (parent) {
            const path = parent.split('.')
            for(const segment of path) {
                if (nestedErrors && segment in nestedErrors) {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    nestedErrors = nestedErrors?.[segment]
                }
            }
        }
        return (nestedErrors?.[fieldName]?.message || '') as ReactNode
    }

    private static getNestedErrorValidationStatus<T extends FieldErrors>(fieldName: keyof T, errors: FieldErrors<T>, parent?: string) {
        let nestedErrors = errors
        if (parent) {
            const path = parent.split('.')
            for(const segment of path) {
                if (nestedErrors && segment in nestedErrors) {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    nestedErrors = nestedErrors?.[segment]
                }
            }
        }
        return nestedErrors?.[fieldName as string] ? 'error' : ''
    }
    
    private static setError<T extends FieldErrors>(fieldName: keyof T, errors: FieldErrors<T>, parent?: string) {
        const onlyParent = FormUtils.getOnlyParent(parent);
        return FormUtils.getNestedError(fieldName, errors, onlyParent)
    }
    
    private static setValidation<T extends FieldErrors>(fieldName: keyof T, errors: FieldErrors<T>, parent?: string) {
        const onlyParent = FormUtils.getOnlyParent(parent)
        return FormUtils.getNestedErrorValidationStatus(fieldName, errors, onlyParent)
    }

    private static getOnlyParent(parent?: string) {
        return FormUtils.genericOnlyParent('.', parent)
    }

    private static genericOnlyParent(splitter: string, parent?: string) {
        const parents = parent?.split(splitter);
        return parents && parents.length > 1 ? parents.slice(1).join(splitter) : parent as string
    }
}

export { FormUtils };