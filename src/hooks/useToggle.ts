import {useState} from "react";

export const useToggle = (initial: boolean): [boolean, () => void] => {
    const [state, setState] = useState<boolean>(initial)
    const toggle = () => setState(prevState => !prevState)
    return [state, toggle]
}