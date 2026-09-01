import {ReactNode, useEffect} from "react";
import {useSettingStore} from "@/core/global/settingStore.ts";
import {useShallow} from "zustand/react/shallow";
import {loggedUser} from "@/auth/jwt/LoggedUser.ts";

const SettingsProvider = ({children}: { children: ReactNode }) => {
    const { fetch, clear, tenantId } = useSettingStore(useShallow(s => ({ fetch: s.fetchSettings, clear: s.clear, tenantId: s.tenantId })))

    useEffect(() => {
        if(tenantId && (tenantId !== loggedUser.getSchool()?.id)) clear()

        fetch().then(r => r)
    }, [clear, fetch, tenantId])
    
    return <>{children}</>
}

export default SettingsProvider