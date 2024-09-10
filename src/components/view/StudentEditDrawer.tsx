import RightSidePane from "../ui/layout/RightSidePane.tsx";
import IndividualForm from "../inscription/IndividualForm.tsx";
import {useForm} from "react-hook-form";
import {StudentSchema} from "../../utils/interfaces.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import {enrollmentSchema} from "../../schema";
import {Student} from "../../entity";

interface EditProps {
    open: boolean
    close: () => void
    isLoading: boolean
    data: Student
}

const StudentEditDrawer = ({open, close, isLoading, data}: EditProps) => {

    const {watch, control, formState: {errors}} = useForm<StudentSchema>({
        resolver: zodResolver(enrollmentSchema)
    })

    console.log('Student: ', watch())
    console.log('Errors: ', errors)

    return (
        <RightSidePane loading={isLoading} open={open} onClose={close} className='edit-drawer' destroyOnClose>
            <IndividualForm control={control} errors={errors} edit={true} data={data} />
        </RightSidePane>
    )
}

export default StudentEditDrawer;