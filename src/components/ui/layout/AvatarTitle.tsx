import {Avatar} from "./Avatar.tsx";
import {Flex} from "antd";
import {setFirstName} from "../../../utils/utils.ts";
import {AvatarProps} from "../ui_interfaces.ts";
import {SuperWord} from "../../../utils/tsxUtils.tsx";

type AvatarTitleProps = AvatarProps & {
    setColor?: (color: string) => void;
    gap?: number;
    size?: number;
    isUpper?: boolean;
}

export const AvatarTitle = ({image, reference, lastName, firstName, setColor, gap, size, isUpper}: AvatarTitleProps)=>  {

    const avatarText = <SuperWord
        input={`${lastName ? lastName?.toUpperCase() + ',' : ''}${firstName ? ' ' + setFirstName(firstName): ''}`}
        isUpper={isUpper}
    />

    return(
        <Flex className="avatar-container" align='center' gap={gap ?? 10}>
            <Avatar image={image} firstText={firstName} lastText={lastName} size={size ?? 60} setColor={setColor} />
            <Flex className="legal" vertical justify='center'>
                <span className='title'>
                    {avatarText}
                </span>
                <span className='mention'>{reference}</span>
            </Flex>
        </Flex>
    )
}