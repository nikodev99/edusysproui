import {useLocation, useParams} from "react-router-dom";

const EmployeeViewPage = () => {
  const location = useLocation()

  const {state: employeeID} = location


  return(
      <div></div>
  )
}

export default EmployeeViewPage;