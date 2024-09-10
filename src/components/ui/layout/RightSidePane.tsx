import {Drawer, DrawerProps} from "antd";

const RightSidePane = (drawerProps: DrawerProps) => {
    return (
        <Drawer {...drawerProps}>
            {drawerProps.children}
        </Drawer>
    )
}

export default RightSidePane