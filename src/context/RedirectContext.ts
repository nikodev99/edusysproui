import {RedirectFunction} from "../utils/interfaces.ts";

let navigate: RedirectFunction = () => {
    throw Error('RedirectContext not implemented');
}

export const setNavigate = (navFunction: RedirectFunction) => {
    navigate = navFunction;
}

const redirectTo = (link: string) => {
    if (navigate) {
        navigate(link);
    }else {
        console.warn('RedirectContext not implemented');
    }
}

export {redirectTo}