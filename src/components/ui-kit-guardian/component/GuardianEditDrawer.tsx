import RightSidePane from "../../ui/layout/RightSidePane.tsx";
import {EditProps} from "../../../utils/interfaces.ts";
import {Guardian} from "../../../entity";

export const GuardianEditDrawer = ({isLoading, open, close}: EditProps<Guardian>) => {
    return(
        <RightSidePane loading={isLoading} open={open} onClose={close} className='edit-drawer' destroyOnClose>
            <div>Edit Here</div>
        </RightSidePane>
    )
}