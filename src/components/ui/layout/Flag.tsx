import {Avatar} from "antd";
import {AvatarSize} from "antd/es/avatar/AvatarContext";

export const Flag = ({desc, media, size}: {desc?: string, media?: string, size?: AvatarSize}) => {
    return (
        <Avatar alt={desc} shape='circle' size={size} src={
            <img
                alt={`Drapeau ${desc}`}
                src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${media?.toUpperCase()}.svg`}
            />
        }/>
    )
}