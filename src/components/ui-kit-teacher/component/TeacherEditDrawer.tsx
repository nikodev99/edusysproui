import {EditProps} from "@/core/utils/interfaces.ts";
import RightSidePane from "@/components/ui/layout/RightSidePane.tsx";
import {Teacher, Classe, Course} from "@/entity";
import {ReactNode, useEffect, useMemo, useState} from "react";
import {useToggle} from "@/hooks/useToggle.ts";
import FormSuccess from "@/components/ui/form/FormSuccess.tsx";
import FormError from "@/components/ui/form/FormError.tsx";
import {Button, Empty, Modal, Radio, Select, Space, Tabs, Tag, Typography} from "antd";
import {AddressOwner, ContractOwner, IndividualType} from "@/core/shared/sharedEnums.ts";
import {UpdateAddress} from "@/components/custom/UpdateAddress.tsx";
import {UpdatePersonalData} from "@/components/custom/UpdatePersonalData.tsx";
import {getClasses, getCourses, OperationType} from "@/entity/domain/teacher";
import {useClasseRepo} from "@/hooks/actions/useClasseRepo.ts";
import {useCourseRepo} from "@/hooks/actions/useCourseRepo.ts";
import {useTeacherRepo} from "@/hooks/actions/useTeacherRepo.ts";
import {catchError} from "@/data/action/error_catch.ts";
import {Notification} from "@/components/custom/Notification.tsx";
import {ModalConfirmButton} from "@/components/ui/layout/ModalConfirmButton.tsx";
import {UpdateEmployeeContract} from "@/components/custom/UpdateEmployeeContract.tsx";

interface TeacherClassCourseModalProps {
    open: boolean
    onClose: () => void
    teacherId: string
    /** Classes currently assigned to this teacher. */
    currentClasses: Classe[]
    /** Courses currently assigned to this teacher. */
    currentCourses: Course[]
}

const { Text } = Typography;

type TabKey = "classes" | "courses";

const TeacherEditDrawer = ({open, close, data}: EditProps<Teacher>) => {

    const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined)
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)
    const [addressDrawer, showAddressDrawer] = useToggle(false)
    const [teacherJob, showTeacherJob] = useToggle(false)
    const [editClasses, setEditClasses] = useToggle(false)

    useEffect(() => {
        if(successMessage || errorMessage) {
            const timer = setTimeout(() => {
                setErrorMessage(undefined)
                setSuccessMessage(undefined)
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [errorMessage, successMessage]);

    const closeAddressDrawer = () => {
        setErrorMessage(undefined)
        setSuccessMessage(undefined)
        showAddressDrawer()
    }

    const closeTeacherJob = () => {
        setErrorMessage(undefined)
        setSuccessMessage(undefined)
        showTeacherJob()
    }

    const classes = getClasses(data)
    const courses = getCourses(data)

    return(
        <RightSidePane loading={data?.personalInfo === null} open={open} onClose={close}>
            {successMessage && (<FormSuccess message={successMessage}/>)}
            {errorMessage && (<FormError message={errorMessage}/>)}
            <UpdatePersonalData
                data={data}
                personal={IndividualType.TEACHER}
                setSuccessMessage={setSuccessMessage}
                setErrorMessage={setErrorMessage}
            />
            <Space style={{marginBottom: 10}} direction="vertical">
                <Button type='link' size='small' onClick={showAddressDrawer}>Modifier l'adresse </Button>
                <Button type='link' size='small' onClick={showTeacherJob}>Modifier terme de contrat </Button>
                <Button type='link' size='small' onClick={setEditClasses}>Classe & Cours </Button>
            </Space>
            {teacherJob && <UpdateEmployeeContract
                open={teacherJob}
                close={closeTeacherJob}
                data={data}
                personal={ContractOwner.TEACHER}
                setSuccessMessage={setSuccessMessage}
                setErrorMessage={setErrorMessage}
            />}
            {addressDrawer && <UpdateAddress
                data={data}
                open={addressDrawer}
                close={closeAddressDrawer}
                personal={AddressOwner.TEACHER}
                setSuccessMessage={setSuccessMessage}
                setErrorMessage={setErrorMessage}
            />}
            {data && editClasses && <TeacherClassCourseModal
                open={editClasses}
                teacherId={data?.id as string}
                currentClasses={classes as Classe[]}
                currentCourses={courses as Course[]}
                onClose={setEditClasses}
            />}
        </RightSidePane>
    )
}

const TeacherClassCourseModal = ({open, onClose, teacherId, currentClasses, currentCourses}: TeacherClassCourseModalProps) => {
    const [activeTab, setActiveTab] = useState<TabKey>("classes");
    const [mode, setMode] = useState<keyof typeof OperationType>("ADD");
    const [selectedClassIds, setSelectedClassIds] = useState<number[]>([]);
    const [selectedCourseIds, setSelectedCourseIds] = useState<number[]>([]);
    const [message, setMessage] = useState<{success?: ReactNode, error?: ReactNode}>()

    const {classes} = useClasseRepo()
    const {courses} = useCourseRepo()
    const {useUpdateCourses, useUpdateClasses} = useTeacherRepo()

    const updateClasses = useUpdateClasses(teacherId);
    const updateCourses = useUpdateCourses(teacherId);

    // Reset selection whenever the tab or mode changes, so a stale selection
    // from "add classes" can't accidentally get submitted as "remove courses".
    useEffect(() => {
        setSelectedClassIds([]);
        setSelectedCourseIds([]);
    }, [activeTab, mode]);

    const classOptions = useMemo(() => {
        if (mode === "ADD") {
            const assignedIds = new Set(currentClasses.map((c) => c.id));
            return classes.filter((c) => !assignedIds.has(c.id));
        }
        return currentClasses;
    }, [mode, classes, currentClasses]);

    const courseOptions = useMemo(() => {
        if (mode === "ADD") {
            const assignedIds = new Set(currentCourses.map((c) => c.id));
            return courses.filter((c) => !assignedIds.has(c.id as number));
        }
        return currentCourses;
    }, [mode, courses, currentCourses]);

    const isSubmitting = updateClasses.isPending || updateCourses.isPending;

    const canSubmit =
        activeTab === "classes"
            ? selectedClassIds.length > 0
            : selectedCourseIds.length > 0;

    const handleSubmit = (data?: number[]) => {
        setMessage({success: undefined, error: undefined})
        if (activeTab === "classes") {
            updateClasses.mutate(
                { operationType: OperationType[mode], classIds: data ? data : selectedClassIds },
                {
                    onSuccess: (r) => {
                        setMessage({success: r.data, error: undefined})
                        setSelectedClassIds([]);
                    },
                    onError: (r) => {
                        setMessage({success: undefined, error: catchError(r) as string})
                    },
                }
            );
        } else {
            updateCourses.mutate(
                { operationType: OperationType[mode], courseIds: data ? data : selectedCourseIds },
                {
                    onSuccess: (r) => {
                        setMessage({success: r.data})
                        setSelectedCourseIds([]);
                    },
                    onError: (r) => {
                        setMessage({error: catchError(r) as string})
                    },
                }
            );
        }
    };

    return(<>
        {message && <Notification responseMessages={message as never} onlyNotif />}
        <Modal
            title="Modification des classes et des cours"
            open={open}
            onCancel={onClose}
            footer={
                <Space>
                    <Button onClick={onClose}>Done</Button>
                    <ModalConfirmButton
                        handleFunc={handleSubmit}
                        btnProps={{
                            type: 'primary',
                            disabled: !canSubmit,
                            loading: isSubmitting,
                        }}
                        btnTxt={`${mode === "ADD" ? "Ajouter" : "Rétiré"} ${activeTab === "classes" ? "classes" : "cours"}`}
                    />
                </Space>
            }
            width={560}
        >
            <Tabs
                activeKey={activeTab}
                onChange={(key) => setActiveTab(key as TabKey)}
                items={[
                    { key: "classes", label: "Classes" },
                    { key: "courses", label: "Matières", disabled: !currentClasses?.length },
                ]}
            />

            <Space direction="vertical" style={{ width: "100%" }} size="middle">
                <Radio.Group
                    value={mode}
                    onChange={(e) => setMode(e.target.value)}
                    optionType="button"
                    buttonStyle="solid"
                >
                    <Radio.Button value="ADD">Ajouter</Radio.Button>
                    <Radio.Button value="REMOVE">Retiré</Radio.Button>
                </Radio.Group>
                <Space>
                    {activeTab === "classes" ? (
                        currentClasses?.map(c => (
                            <Tag key={c.id} closable={mode === 'REMOVE'} onClose={mode === "REMOVE" ? () => handleSubmit([c.id]) : undefined}>
                                {c.name}
                            </Tag>
                        ))
                    ): currentCourses?.map(c => (
                        <Tag key={c.id} closable={mode === 'REMOVE'} onClose={mode === "REMOVE" ? () => handleSubmit([c.id as number]) : undefined}>
                            {c.course}
                        </Tag>
                    ))}
                </Space>

                {activeTab === "classes" ? (
                    <>
                        <Text type="secondary">
                            {mode === "ADD"
                                ? "Sélectionner les classes à assigner à cet enseignant"
                                : "Sélectionner les classes à rétirer à cet enseignant."}
                        </Text>
                        <Select
                            mode="multiple"
                            style={{ width: "100%" }}
                            placeholder={
                                mode === "ADD" ? "Choisissez les classes à ajouter" : "Choisissez les classes à rétirer"
                            }
                            value={selectedClassIds}
                            onChange={setSelectedClassIds}
                            optionFilterProp="label"
                            notFoundContent={
                                <Empty
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    description={
                                        mode === "ADD"
                                            ? "Aucune classe assigné à l'enseignant."
                                            : "Cet enseignant n'a aucune classe à rétirés."
                                    }
                                />
                            }
                            options={classOptions.map((c) => ({
                                value: c.id,
                                label: c?.department?.id
                                    ? `${c.name} — ${c?.department?.name}`
                                    : c.name,
                            }))}
                        />
                    </>
                ) : (currentCourses && currentCourses.length > 0) ? (
                    <>
                        <Text type="secondary">
                            {mode === "ADD"
                                ? "Sélectionner les cours à assigner à l'enseignant"
                                : "Sélectionner les cours à rétirer à l'enseignant."}
                        </Text>
                        <Select
                            mode="multiple"
                            style={{ width: "100%" }}
                            placeholder={
                                mode === "ADD" ? "Choisissez les cours à ajouter" : "Choisissez les cours à rétirer "
                            }
                            value={selectedCourseIds}
                            onChange={setSelectedCourseIds}
                            optionFilterProp="label"
                            notFoundContent={
                                <Empty
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    description={
                                        mode === "ADD"
                                            ? "Aucun cours n'est assigné à cet enseignant"
                                            : "Cet enseignant n'a aucun cours assigné à rétirés"
                                    }
                                />
                            }
                            options={courseOptions.map((c) => ({
                                value: c.id,
                                label: `${c.course} (${c.abbr})`,
                            }))}
                        />
                    </>
                ): null}
            </Space>
        </Modal>
    </>)
}

export {TeacherEditDrawer}