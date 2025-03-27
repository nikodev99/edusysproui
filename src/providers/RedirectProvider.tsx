import {createContext, FC, ReactNode, useContext, useEffect} from "react";
import {RedirectFunction} from "../core/utils/interfaces.ts";
import {useNavigate} from "react-router-dom";
import {setNavigate} from "../context/RedirectContext.ts";

const NavigationContext = createContext<RedirectFunction | undefined>(() => {})

const RedirectProvider: FC<{ children: ReactNode }> = ({ children }) => {

    const navigate = useNavigate()

    useEffect(() => {
        setNavigate(navigate)
    }, [navigate]);

    return(
        <NavigationContext.Provider value={undefined}>
            {children}
        </NavigationContext.Provider>
    )
}

export const useRedirect = () => {
    const context = useContext(NavigationContext);
    if (context === undefined) {
        throw Error('Error redirect is not initialized')
    }
    return context
}

export default RedirectProvider