import {ClasseBossesProps} from "@/entity/domain/classe.ts";
import {ConfirmationModal, Messages} from "@/components/ui/layout/ConfirmationModal.tsx";
import {Select, Space} from "antd";
import {useCourseRepo} from "@/hooks/actions/useCourseRepo.ts";
import {useState} from "react";
import {useClasseRepo} from "@/hooks/actions/useClasseRepo.ts";
import {catchError} from "@/data/action/error_catch.ts";

export const AddClassePrincipalCourse = ({classeId, open = false, onClose, classe}: ClasseBossesProps) => {
    const [course, setCourse] = useState<number | null>(classe?.principalCourse?.id || null)
    const [message, setMessage] = useState<Messages>()
    const {courseOptions} = useCourseRepo()
    const {useUpdateClasseCourse} = useClasseRepo()
    const update = useUpdateClasseCourse(classeId)

    const handleChange = (courseId: number) => {
        setCourse(courseId)
    }

    const handleSubmit = () => {
        setMessage({success: null, error: null})
        update.mutate({courseId: course as number}, {
            onSuccess: r => {
                if (r.data > 0)
                    setMessage({success: "Matière principale mis à jour avec succès"})
            },
            onError: e => setMessage({error: catchError(e) as string})
        })
    }

    return(
        <ConfirmationModal
            data={{id: classeId}}
            open={open}
            close={onClose as () => void}
            handleFunc={handleSubmit}
            customComponent={<Space align={'center'}>
                <Select
                    options={courseOptions}
                    defaultValue={classe?.principalCourse?.id}
                    placeholder='Matière principale'
                    style={{width: 250}}
                    onChange={handleChange}
                />
            </Space>}
            messages={message}
            alertDesc={{alert: false} as never}
            modalTitle={"Ajouter une matière principale"}
            modalProps={{
                width: 400
            }}
            btnProps={{
                type: 'primary'
            }}
            btnTxt={"Ajouter"}
        />
    )
}