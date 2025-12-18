import {ConfirmationModal} from "@/components/ui/layout/ConfirmationModal.tsx";
import {Enrollment, Individual} from "@/entity";
import {setFirstName} from "@/core/utils/utils.ts";
import {useEffect, useMemo, useState} from "react";
import Datetime from "@/core/datetime.ts";
import {text} from "@/core/utils/text_display.ts";
import {LuCircleArrowOutUpRight} from "react-icons/lu";
import {AcademicForm} from "./AcademicForm.tsx";
import {useActivity} from "@/hooks/useActivity.ts";
import {Option} from "@/core/utils/interfaces.ts";
import {useEnrollmentForm} from "@/hooks/useEnrollmentForm.ts";
import {Form} from "antd";
import {useGlobalStore} from "@/core/global/store.ts";

export const StudentPromotion = ({student, open, close, setRefresh}: {
    student: Enrollment,
    open: boolean,
    close: () => void,
    setRefresh?: (value: boolean) => void
}) => {
    const {promoteStudentActivity} = useActivity()
    const breakpoints = useGlobalStore(state => state.modalBreakpoints)

    const [promotedClasse, setPromotedClasse] = useState<Option>()

    const {academicYear, ind, classe} = useMemo(() => ({
        academicYear: student?.academicYear,
        ind: student?.student?.personalInfo,
        classe: student?.classe
    }), [student]);

    const {control, errors, handleSubmit, onSubmit, successMessage, errorMessage, setSuccessMessage, setErrorMessage} = useEnrollmentForm(student?.student?.id)

    const isCurrent = useMemo(() =>
        Datetime.now().isBetween(academicYear?.startDate, academicYear?.endDate),
        [academicYear?.endDate, academicYear?.startDate]
    )

    useEffect(() => {
        if (open) {
            setErrorMessage(undefined)
            setSuccessMessage(undefined)
            setRefresh && setRefresh(false)
        }
    }, [open, setErrorMessage, setRefresh, setSuccessMessage])

    const handleClose = () => {
        setSuccessMessage(undefined)
        setErrorMessage(undefined)
        setRefresh?.(true)
        close()
    }

    const handleActivity = () => promoteStudentActivity(ind as Individual, classe?.name as string, promotedClasse?.label as string)

    console.log({promotedClasse})
    
    return(
        <ConfirmationModal 
            data={student} 
            open={open} 
            close={handleClose}
            handleFunc={() => handleSubmit(onSubmit)()}  
            modalTitle={`Promotion de ${setFirstName(`${ind?.lastName} ${ind?.firstName}`)}`}
            alertDesc={{
                type: isCurrent ? 'warning' : 'info',
                msg: `Vous êtes sur le point de promouvoir un ${(text.student.label).toLocaleLowerCase()}: 
                ${ind?.lastName} ${ind?.firstName}, ${isCurrent ? 'au cours de l\'année,' : ''} à une classe supérieure.`
            }}
            messages={{success: successMessage, error: errorMessage}}
            content={`Veuillez cliquer sur OUI pour promouvoir ${ind?.lastName} ${ind?.firstName} à la classe de votre choix et ainsi mettre fin à son inscription à sa présente classe: ${classe?.name}`}
            btnTxt={'Promouvoir'}
            btnProps={{
                icon: <LuCircleArrowOutUpRight />,
                type: 'primary',
            }}
            customComponent={<Form layout='vertical'>
                <AcademicForm
                    control={control}
                    errors={errors}
                    validationTriggered={true}
                    getSchool={setPromotedClasse}
                />
            </Form>}
            setActivity={handleActivity}
            justify={'center'}
            modalProps={{
                width: breakpoints,
            }}
        /> 
    )
}