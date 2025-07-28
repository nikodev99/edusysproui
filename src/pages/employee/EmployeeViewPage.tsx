import {useLocation} from "react-router-dom";
import {useDocumentTitle} from "../../hooks/useDocumentTitle.ts";
import {useBreadCrumb} from "../../hooks/useBreadCrumb.tsx";
import {text} from "../../core/utils/text_display.ts";
import {useEffect, useMemo, useState} from "react";
import {Employee} from "../../entity";
import {useEmployeeRepo} from "../../hooks/useEmployeeRepo.ts";
import {chooseColor, setName} from "../../core/utils/utils.ts";
import ViewHeader from "../../components/ui/layout/ViewHeader.tsx";
import {Tag} from "antd";
import {getStatusKey, Status} from "../../entity/enums/status.ts";
import {Gender} from "../../entity/enums/gender.tsx";
import {ViewRoot} from "../../components/custom/ViewRoot.tsx";
import {EmployeeActionLinks, EmployeeEditDrawer} from "../../components/ui-kit-employee";
import {useToggle} from "../../hooks/useToggle.ts";
import {LuUserRound} from "react-icons/lu";
import {useAccount} from "../../hooks/useAccount.ts";

type ActionsButtons = {
    createUser?: boolean
}

const EmployeeViewPage = () => {
    const location = useLocation()
    const {state: employeeID} = location

    useDocumentTitle({
        title: "Employee View",
        description: "Employee View description",
    })

    const [employee, setEmployee] = useState<Employee | null>(null)
    const [openActions, setOpenActions] = useState<ActionsButtons>({})
    const [showAction, setShowAction] = useState<ActionsButtons>({})
    const [openDrawer, setOpenDrawer] = useToggle(false)
    const {useGetEmployee} = useEmployeeRepo()
    const {useAccountExists} = useAccount()

    const {data, isLoading, isSuccess, refetch} = useGetEmployee(employeeID)
    const color: string = chooseColor(employee?.personalInfo?.firstName)

    const employeeFullName = useMemo(() => setName(employee?.personalInfo), [employee?.personalInfo])
    const accountExists = useAccountExists(employee?.personalInfo?.id as number)

    const {context} = useBreadCrumb({
        bCItems: [
            {title: text.employee.label, path: text.employee.href},
            {title: employeeFullName}
        ]
    })

    useEffect(() => {
        if (isSuccess && data) {
            setEmployee(data as Employee)
        }
        
        setShowAction({createUser: accountExists})
    }, [accountExists, data, isSuccess]);

    const handleCloseDrawer = () => {
        setOpenDrawer()
        refetch().then(r => r.data)
    }

    console.log("ACTIONS: ", openActions)

  return(
      <>
        {context}
        <ViewHeader
            isLoading={isLoading}
            setEdit={setOpenDrawer}
            closeState={false}
            avatarProps={{
              personalInfo: employee?.personalInfo
            }}
            blockProps={[
              {
                title: 'Etat Civil',
                mention: <Tag color={color}>{
                  getStatusKey(
                      employee?.personalInfo?.status as Status,
                      employee?.personalInfo?.gender === Gender.FEMME
                  )}</Tag>
              },
              {title: 'Télephone', mention: employee?.personalInfo?.telephone},
              {title: 'Poste', mention: <Tag>{employee?.jobTitle}</Tag>},
            ]}
            items={[
                ...(accountExists ? [] :  [{
                    key: 2,
                    label: 'Compte Employee',
                    icon: <LuUserRound />,
                    onClick: () => setOpenActions({ createUser: true })  // Remove the type assertion
                }])
            ]}
        />
        <ViewRoot
            items={[
              {label: 'Info', children: <div>'Info'</div>},
              {label: 'Historique', children: <div>'Historique'</div>},
            ]}
            exists={employee !== null}
            memorizedTabKey={'employeeTabKey'}
        />
        <section>
          <EmployeeEditDrawer open={openDrawer} close={handleCloseDrawer} isLoading={isLoading} data={employee as Employee} />
        </section>
        <section>
            <EmployeeActionLinks
                open={openActions}
                setActions={setOpenActions}
                personalInfo={employee?.personalInfo} 
                show={showAction}
            />
        </section>
      </>
  )
}

export default EmployeeViewPage;