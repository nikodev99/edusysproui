import {Alert, Modal} from "antd";
import {ActionDrawer} from "@/core/utils/interfaces.ts";
import {Guardian} from "@/entity";
import {setName} from "@/core/utils/utils.ts";

export const RemoveGuardian = ({data, open, close}: ActionDrawer<Guardian>) => {
    return <Modal open={open} onCancel={close} title={`Supprimé ${setName(data?.personalInfo)}`} onOk={close}>
        <Alert type={'warning'} message={
            `Rétiré les tutoré(s) de ${setName(data?.personalInfo)} pour le supprimé dans le systèm.`
        } showIcon  />
    </Modal>
}