import {useNavigate} from "react-router-dom";

export const useNavigation = (url: string) => {
    const navigate = useNavigate();
    return navigate(url);
}