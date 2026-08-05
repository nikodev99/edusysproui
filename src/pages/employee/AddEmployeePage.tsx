import {text} from "@/core/utils/text_display.ts";
import {AddStepForm} from "@/components/custom/AddStepForm.tsx";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {EmployeeSchema} from "@/schema";
import {employeeSchema} from "@/schema/models/employeeSchema.ts";
import {ReactNode, useMemo, useState, useTransition} from "react";
import {IndividualForm} from "@/components/forms/IndividualForm.tsx";
import {AddressOwner, ContractOwner, IndividualType} from "@/core/shared/sharedEnums.ts";
import {Gender} from "@/entity/enums/gender.tsx";
import {Status} from "@/entity/enums/status.ts";
import AddressForm from "@/components/forms/AddressForm.tsx";
import {AttachmentForm} from "@/components/ui-kit-student";
import {OutputFileEntry} from "@uploadcare/blocks";
import {useEmployeeRepo} from "@/hooks/actions/useEmployeeRepo.ts";
import {EmployeeContractForm} from "@/components/forms/EmployeeContractForm.tsx";
import {useRedirect} from "@/hooks/useRedirect.ts";
import {useAuth} from "@/hooks/useAuth.ts";

const AddEmployeePage = () => {
  const metadata = {
    title: "Ajouter Employée",
    description: "Ajouter Employée"
  }

  const items = [
    {
      title: text.employee.label,
      path: text.employee.href
    },
    {
      title: text.employee.group.add.label
    }
  ];

  const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined)
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)
  const [validationTriggered, setValidationTriggered] = useState(false)
  const [image, setImage] = useState<string | undefined>(undefined)
  const [isPending, startTransition] = useTransition()
  const {toAddEmployee} = useRedirect()
  const {useInsertEmployee} = useEmployeeRepo()
  const {userSchool} = useAuth()

  const form = useForm<EmployeeSchema>({
    resolver: zodResolver(employeeSchema)
  })

  const {formState: {isLoading, errors, submitCount, isSubmitting, isValidating}, watch, control, clearErrors, trigger} = form

  const {insert, isLoading: insertLoading} = useInsertEmployee()

  const formData = watch()

  const showMaidenName = useMemo(() =>
          formData?.personalInfo?.gender === Gender.FEMME &&
          formData?.personalInfo?.status === Status.MARIE,
      [formData?.personalInfo?.gender, formData?.personalInfo?.status]
  )

  const validate = (validateFields: boolean, current: number) => {
    if (validateFields) {
      setValidationTriggered(true);
      clearErrors()
      toAddEmployee(current + 1)
    }
  }

  const triggerNext = async (current: number) => {
    let validateFields: boolean
    try {
      switch (current) {
        case 0:
          validateFields = await trigger([
            "personalInfo.lastName", "personalInfo.firstName", "personalInfo.gender", "personalInfo.status",
            "personalInfo.birthDate", "personalInfo.birthCity", "personalInfo.nationality", "personalInfo.emailId",
            "personalInfo.telephone"
          ])
          validate(validateFields, current);
          break
        case 1:
          validateFields = await trigger([
            'personalInfo.address.number', 'personalInfo.address.street', 'personalInfo.address.neighborhood',
            'personalInfo.address.city', 'personalInfo.address.country'
          ])
          validate(validateFields, current);
          break
        case 2:
          validateFields = await trigger([
              'contract.role', "contract.contractType", "contract.salaryBasis", "contract.currency", "contract.startDate",
          ])
              validate(validateFields, current);
          break
      }
    }catch (error) {
      console.error('Trigger Errors: ', error)
    }
  }

  const handleUploadChange = (items?: {allEntries: OutputFileEntry[]}) => {
    const file = items?.allEntries[0]
    if (file && file.status === 'success' && file.cdnUrl && file.name) {
      setImage(`${file.cdnUrl}${file.name}`)
    }
  }

  const steps: {title: ReactNode, content: ReactNode}[] = [
    {
      title: 'Information Personnelles',
      content: <IndividualForm 
          control={control} 
          errors={errors} 
          edit={false}
          showField={showMaidenName}
          clearErrors={clearErrors}
          type={IndividualType.EMPLOYEE} 
      />
    },
    {
      title: 'Adresse',
      content: <AddressForm
          control={control}
          type={AddressOwner.EMPLOYEE}
          edit={false}
          errors={errors}
          validationTriggered={validationTriggered}
          clearErrors={clearErrors}
      />
    },
    {
      title: 'Embauche',
      content: <EmployeeContractForm
          type={ContractOwner.EMPLOYEE}
          control={control as never}
          errors={errors}
          edit={false}
          clearErrors={clearErrors as never}
      />
    },
    {
      title: 'Attachements',
      content: <AttachmentForm
          onChange={handleUploadChange}
          imageCdn={image}
      />
    }
  ]

  const onSubmit = (data: EmployeeSchema) => {
    setErrorMessage(undefined)
    setSuccessMessage(undefined)
    const school = userSchool

    if(submitCount === 0 && school !== null && school?.id) {
      data = {...data, personalInfo: {...data.personalInfo,
          image: image,
        },
        school: {...data.school,
          id: school?.id
        }
      }

      startTransition(() => {
        insert(data, [])
            .then(resp => {
              if (resp.success)
                setSuccessMessage("Employée ajouté avec success")
              if (resp.error)
                setErrorMessage(`${resp.status} - ${resp.error}`)
            })
      })
    }else {
      setErrorMessage(`Impossible d'ajouté l'employée {submitCount=${submitCount}, école=${school?.name}}`)
    }
  }

  return (
      <AddStepForm
          docTitle={metadata}
          breadCrumb={items}
          prevRedirect={toAddEmployee}
          handleForm={form}
          triggerNext={triggerNext}
          onSubmit={onSubmit}
          steps={steps}
          messages={{success: successMessage, error: errorMessage}}
          isPending={(isSubmitting || isLoading || isValidating || isPending || insertLoading) as boolean}
          currentNumber={4}
      />
  )
}

export default AddEmployeePage;