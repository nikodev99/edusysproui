import {InsertModal} from "@/components/custom/InsertSchema.tsx";
import {
    bankPayment,
    CreditCardPayment,
    MobileMobilePayment, mobileMoneyPayment,
    PaymentGateway,
    PaymentMethod, paymentSchema,
    PaymentSchema
} from "@/finance/models/payment.ts";
import {Avatar, Card, Flex, Segmented, Typography} from "antd";
import {PaymentForms} from "@/components/forms/PaymentForms.tsx";
import {Invoice} from "@/finance/models/invoice.ts";
import {useUserRepo} from "@/hooks/actions/useUserRepo.ts";
import {GatewayPayment} from "@/finance/apis/GatewayPayment.ts";
import {useEffect, useMemo, useState} from "react";
import {loggedUser} from "@/auth/jwt/LoggedUser.ts";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Guardian} from "@/entity";
import {useGuardianRepo} from "@/hooks/actions/useGuardianRepo.ts";

export interface SinglePayProps<T extends Invoice> {
    guardian?: Guardian
    selectedInvoice: T
    showPane?: boolean
    closePane?: () => void
    onChangePaymentGateway?: (gateway: PaymentGateway) => void
    payementGateway?: PaymentGateway
}

export const SinglePayComponent = (
    {showPane, closePane, selectedInvoice, onChangePaymentGateway, payementGateway, guardian}: SinglePayProps<Invoice>
) => {
    const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined)
    const [transactionId, setTransactionId] = useState<string | undefined>(undefined)
    const {useGetUserAddress} = useUserRepo()
    const {useInitPayment} = useGuardianRepo()
    const {insert} = useInitPayment()

    const { paymentData, isStripe } = useMemo(() => ({
        paymentData: payementGateway === PaymentGateway.STRIPE ? bankPayment : mobileMoneyPayment,
        isStripe: payementGateway === PaymentGateway.STRIPE
    }), [payementGateway])

    const address = useGetUserAddress({enable: isStripe})

    const form = useForm<MobileMobilePayment | CreditCardPayment>({
        resolver: zodResolver(paymentData)
    })

    const paymentFormData = useForm<PaymentSchema>({
        resolver: zodResolver(paymentSchema),
        defaultValues: {
            currency: "XAF"
        }
    })

    const handleInitiatePayment = paymentFormData.handleSubmit((data) => {
        insert(data, [])
            .then(r => {
                if (r.success) {
                    setSuccessMessage(r.data?.message)
                }
            })
    })

    useEffect(() => {
        if (!selectedInvoice || !guardian) return
        paymentFormData.reset({
            student: selectedInvoice?.enrolledStudent?.id,
            invoice: selectedInvoice?.invoiceId,
            amountPaid: selectedInvoice?.totalAmount,
            currency: "XAF",
            paymentMethod: isStripe ? PaymentMethod.BANK_CARD : PaymentMethod.MOBILE_MONEY,
            paymentGateway: payementGateway,
            processedBy: guardian?.personalInfo?.id as number,
            transactionId: transactionId,
            notes: form.getValues("notes"),
            schoolId: loggedUser.getSchool()?.id
        })
    }, [selectedInvoice, guardian, isStripe, paymentFormData, payementGateway, form, transactionId])

    const handlePay = (data: MobileMobilePayment | CreditCardPayment) => {
        switch (payementGateway) {
            case PaymentGateway.AIRTEL_MOMO:
                GatewayPayment.airtelPayment(data as MobileMobilePayment).then(r => {
                    if (r.data?.success) {
                        setTransactionId?.(r?.data?.paymentId)
                        handleInitiatePayment().then()
                    }
                })
                break
            case PaymentGateway.MTN_MOMO:
                GatewayPayment.mtnPayment(data as MobileMobilePayment).then(r => {
                    if (r.data?.success) {
                        setTransactionId?.(r?.data?.paymentId)
                        handleInitiatePayment().then()
                    }
                })
                break
            case PaymentGateway.STRIPE:
                GatewayPayment.bankPayment(data as CreditCardPayment).then(r => {
                    if (r?.data?.success) {
                        setTransactionId?.(r?.data?.paymentId)
                        handleInitiatePayment().then()
                    }
                })
                break
        }
    }

    return(
        <InsertModal
            data={paymentData as never}
            open={showPane}
            onCancel={closePane}
            title={'Paiement electronique de la facture ' + selectedInvoice?.invoiceNumber}
            messageSuccess={successMessage}
            customForm={
                <Flex justify='space-around' align='center' vertical>
                    <div style={{marginBottom: '50px'}}>
                        <Segmented
                            block
                            onChange={onChangePaymentGateway}
                            size='large'
                            options={[
                                {
                                    value: PaymentGateway.MTN_MOMO,
                                    label: <div>
                                        <Avatar src='/mtn-momo.webp' size={100} alt='gateway-1' />
                                        <div>mtn momo</div>
                                    </div>
                                },
                                {
                                    value: PaymentGateway.AIRTEL_MOMO,
                                    label: <div>
                                        <Avatar src='/airtel-momo.png' size={100} alt='gateway-2' />
                                        <div>airtel momo</div>
                                    </div>
                                },
                                {
                                    value: PaymentGateway.STRIPE,
                                    disabled: true,
                                    label: <div>
                                        <Avatar
                                            size={100}
                                            style={{background: '#000'}}
                                            src={<img
                                                src='/card.svg'
                                                alt='gateway-3'
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'contain',
                                                    display: 'block'
                                                }}
                                            />}
                                        />
                                        <div>carte crédit</div>
                                    </div>
                                },
                            ]}
                        />
                    </div>
                    <div style={{padding: 0,margin:0, width: '100%'}}>
                        <Card>
                            <PaymentForms
                                control={form.control}
                                errors={form.formState.errors}
                                gateway={payementGateway as PaymentGateway}
                                data={selectedInvoice as Invoice}
                            />
                            {isStripe && <Card>
                                <div>
                                    <p>{address?.number}, {address?.street}, {address?.neighborhood}</p>
                                    <p>{address?.city}, {address?.country}</p>
                                    <p><Typography.Link italic>Changer d'adresse</Typography.Link></p>
                                </div>
                            </Card>}
                        </Card>
                    </div>
                </Flex>
            }
            okText='Payer'
            handleForm={form as never}
            postFunc={handlePay as never}
        />
    )
}