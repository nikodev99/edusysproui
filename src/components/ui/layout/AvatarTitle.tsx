import Avatar from "./Avatar.tsx";
import {Flex} from "antd";
import {setFirstName} from "../../../utils/utils.ts";
import {AvatarProps} from "../ui_interfaces.ts";

type AvatarTitleProps = AvatarProps & {
    setColor?: (color: string) => void;
    gap?: number;
    size?: number;
}

export const AvatarTitle = ({image, reference, lastName, firstName, setColor, gap, size}: AvatarTitleProps)=>  {
    return(
        <Flex className="avatar-container" align='center' gap={gap ?? 10}>
            <Avatar image={image} firstText={firstName} lastText={lastName} size={size ?? 60} setColor={setColor} />
            <Flex className="legal" vertical justify='center'>
                <span className='title'>{`${lastName?.toUpperCase()}, ${setFirstName(firstName)}`}</span>
                <span className='mention'>{reference}</span>
            </Flex>
        </Flex>
    )
}