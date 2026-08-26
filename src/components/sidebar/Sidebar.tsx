import "./sidebar.scss"
import {Button, Flex, Image, Layout, Menu} from "antd";
import {getMenuItemForUser} from "@/core/menuItems.tsx";
import {useToggle} from "@/hooks/useToggle.ts";
import {LuChevronLeft, LuChevronRight} from "react-icons/lu";
import {redirectTo} from "@/context/RedirectContext.ts";
import {useLocation} from "react-router-dom";
import {useCallback, useMemo} from "react";
import {useAuth} from "@/hooks/useAuth.ts";
import {setFirstName} from "@/core/utils/utils.ts";
import {useText} from "@/core/utils/text_display.ts";

const Sidebar = ({onCollapsed}: {onCollapsed?: boolean}) => {

    const [collapsed, setCollapsed] = useToggle(false)
    const location = useLocation()
    const {isLoggedIn} = useAuth()
    const text = useText()

    const menuItems = useMemo(() => {
        if (isLoggedIn()) 
            return getMenuItemForUser(text)
        else
            return []
    }, [text, isLoggedIn])

    const findSelectedKey = useCallback((): string[] => {
        for (const item of menuItems) {
            if (item && 'children' in item && item?.children) {
                for (const child of item.children) {
                    if (child && 'key' in child && location.pathname.includes(child.key as string)) {
                        return [item.key as string, child.key as string]
                    }
                }
            }
            if (item && 'key' in item && location.pathname.includes(item.key as string)) {
                return [item.key as string]
            }
        }
        return []
    }, [location.pathname, menuItems])

    const handleMenuItemClick = useCallback(({key}: {key: string|null}) => {key ? redirectTo(key) : redirectTo('/')}, [])

    return(
        <Layout.Sider
            theme="light"
            trigger={null}
            collapsed={collapsed}
            collapsible
            className={`sidebar ${onCollapsed ? "show" : ""}`}
            width={250}
        >
            <Flex align='center' justify='center' className='logo-wrapper'>
                <div className="logo">
                    <Image src="/edusyspro.svg" alt="logo" preview={false} width={89} />
                    {collapsed ? '' : <p>EduSysPro</p>}
                </div>
            </Flex>
            <Menu
                onClick={handleMenuItemClick}
                mode="inline"
                className={`menu ${collapsed ? 'show' : ''}`}
                selectedKeys={findSelectedKey()}
                items={menuItems?.map((item) => ({...item, label: item && 'label' in item ? setFirstName(item?.label as string) : ''})) as []}
            />
            <Button
                className='trigger-btn'
                type='text'
                icon={collapsed ? <LuChevronRight /> : <LuChevronLeft />}
                onClick={setCollapsed}
            />
        </Layout.Sider>
    )
}

export default Sidebar