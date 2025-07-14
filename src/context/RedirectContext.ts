import {RedirectFunction} from "../core/utils/interfaces.ts";
import {NavigateOptions} from "react-router-dom";

let navigate: RedirectFunction = () => {
    throw Error('RedirectContext not implemented');
}

export const setNavigate = (navFunction: RedirectFunction) => {
    navigate = navFunction;
}

const redirectTo = (link: string, options?: NavigateOptions) => {
    if (navigate) {
        navigate(link, options);
    }else {
        console.warn('RedirectContext not implemented');
    }
}

export {redirectTo}