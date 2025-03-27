import {FieldErrors} from "react-hook-form";
import {ReactNode} from "react";

class FormUtils {
    static onlyField(toEdit: boolean, editScreen: number, actualScreen: number | undefined) {
        return toEdit ? editScreen : actualScreen;
    }

    static getValidationStatus<T extends FieldErrors>(fieldName: string, errors: FieldErrors<T>, toEdit: boolean, parent?: string, enroll?: boolean) {
        if (toEdit) {
            return errors?.[fieldName] ? 'error' : '';
        } else {
            if (enroll) {
                return FormUtils.getNestedErrorValidationStatus(fieldName, errors, parent)
            }else {
                return FormUtils.setValidation(fieldName, errors, parent);
            }
        }
    }

    static getErrorMessage<T extends FieldErrors>(fieldName: string, errors: FieldErrors<T>, toEdit: boolean, parent?: string, enroll?: boolean): ReactNode {
        if (toEdit) {
            return (errors?.[fieldName]?.message || '') as ReactNode
        } else {
            if (enroll) {
                return FormUtils.getNestedError(fieldName, errors, parent) || ''
            }else {
                return FormUtils.setError(fieldName, errors, parent);
            }
        }
    }

    static setName (fieldName: string, toEdit: boolean, parent?: string, enroll?: boolean) {
        if (toEdit) {
            return fieldName
        }else {
            if (enroll) {
                return parent ? `${parent}.${fieldName}` : fieldName
            }
            return parent ? `${FormUtils.getOnlyParent(parent)}.${fieldName}` : fieldName
        }
    }

    private static getNestedError<T extends FieldErrors>(fieldName: string, errors: FieldErrors<T>, parent?: string): ReactNode {
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

    private static getNestedErrorValidationStatus<T extends FieldErrors>(fieldName: string, errors: FieldErrors<T>, parent?: string) {
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
        return nestedErrors?.[fieldName] ? 'error' : ''
    }
    
    private static setError<T extends FieldErrors>(fieldName: string, errors: FieldErrors<T>, parent?: string) {
        const onlyParent = FormUtils.getOnlyParent(parent);
        return FormUtils.getNestedError(fieldName, errors, onlyParent)
    }
    
    private static setValidation<T extends FieldErrors>(fieldName: string, errors: FieldErrors<T>, parent?: string) {
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