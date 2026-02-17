import {FormContentProps} from "@/core/utils/interfaces.ts";
import {CreditCardPayment, MobileMobilePayment, PaymentGateway} from "@/finance/models/payment.ts";
import FormContent from "@/components/ui/form/FormContent.tsx";
import {Invoice} from "@/finance/models/invoice.ts";
import {InputTypeEnum} from "@/core/shared/sharedEnums.ts";
import {FormConfig} from "@/config/FormConfig.ts";
import {FormUtils} from "@/core/utils/formUtils.ts";
import {useAuth} from "@/hooks/useAuth.ts";


export type PaymentFormProps = FormContentProps<MobileMobilePayment | CreditCardPayment, Invoice> & {
    gateway: PaymentGateway;
}

export const PaymentForms = ({data, control, errors, edit, gateway}: PaymentFormProps) => {
    const form = new FormConfig(errors, edit)
    const onlyField = FormUtils.onlyField(edit as boolean, 24, undefined)
    const {user} = useAuth()

    return(
        <FormContent formItems={[
            ...((gateway === PaymentGateway.MTN_MOMO || gateway === PaymentGateway.AIRTEL_MOMO) ? [
                {
                    type: InputTypeEnum.NUMBER,
                    inputProps: {
                        hasForm: edit,
                        md: onlyField,
                        lg: onlyField,
                        label: "Montant",
                        control: control,
                        name: form.name('amountPaid'),
                        required: true,
                        defaultValue: data?.totalAmount,
                        placeholder: "Montant",
                        validateStatus: form.validate('amountPaid'),
                        help: form.error('amountPaid'),
                        disabled: true
                    }
                },
                {
                    type: InputTypeEnum.TEXT,
                    inputProps: {
                        hasForm: edit,
                        md: onlyField,
                        lg: onlyField,
                        label: "Numéro de téléphone",
                        control: control,
                        name: form.name('phoneNumber'),
                        required: true,
                        defaultValue: user?.phoneNumber,
                        placeholder: "Entrer email de contact",
                        validateStatus: form.validate('phoneNumber'),
                        help: form.error('phoneNumber'),
                    }
                },
                {
                    type: InputTypeEnum.TEXTAREA,
                    inputProps: {
                        hasForm: edit,
                        md: onlyField,
                        lg: onlyField,
                        label: "Reference",
                        control: control,
                        name: form.name('notes'),
                        required: true,
                        placeholder: "Notes",
                        validateStatus: form.validate('notes'),
                        help: form.error('notes'),
                    }
                },
            ] : [
                {
                    type: InputTypeEnum.TEXT,
                    inputProps: {
                        md: onlyField ?? 12,
                        lg: onlyField ?? 12,
                        label: "Numéro de la carte",
                        control: control,
                        name: form.name('cardNumber'),
                        required: true,
                        placeholder: "Numero de la carte",
                        validateStatus: form.validate('cardNumber'),
                        help: form.error('cardNumber'),
                    }
                },
                {
                    type: InputTypeEnum.NUMBER,
                    inputProps: {
                        md: onlyField ?? 12,
                        lg: onlyField ?? 12,
                        label: "CCV",
                        control: control,
                        name: form.name('cardCCV'),
                        required: true,
                        placeholder: "CCV",
                        validateStatus: form.validate('cardCCV'),
                        help: form.error('cardCCV'),
                    }
                },
                {
                    type: InputTypeEnum.TEXT,
                    inputProps: {
                        md: onlyField ?? 12,
                        lg: onlyField ?? 12,
                        label: "Nom du détenteur de la cate",
                        control: control,
                        name: form.name('cardHolder'),
                        required: true,
                        placeholder: "Nom du détenteur de la cate",
                        validateStatus: form.validate('cardHolder'),
                        help: form.error('cardHolder'),
                    }
                },
                {
                    type: InputTypeEnum.DATE,
                    inputProps: {
                        md: onlyField ?? 12,
                        lg: onlyField ?? 12,
                        label: "Date d'expiration",
                        control: control,
                        name: form.name('cardExpiry'),
                        required: true,
                        placeholder: "Date d'expiration",
                        validateStatus: form.validate('cardExpiry'),
                        help: form.error('cardExpiry'),
                        format: "YYYY-MM"
                    }
                }
            ]),
        ]} />
    )
}