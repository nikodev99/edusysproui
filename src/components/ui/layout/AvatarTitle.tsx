import {Avatar} from "./Avatar.tsx";
import {Flex} from "antd";
import {setFirstName} from "../../../core/utils/utils.ts";
import {AvatarProps} from "../ui_interfaces.ts";
import {SuperWord} from "../../../core/utils/tsxUtils.tsx";
import {redirectTo} from "../../../context/RedirectContext.ts";

type AvatarTitleProps = AvatarProps & {
    setColor?: (color: string) => void;
    gap?: number
    size?: number
    isUpper?: boolean
    link?: string
}

export const AvatarTitle = ({image, reference, lastName, firstName, setColor, gap, size, isUpper, link}: AvatarTitleProps)=>  {

    const avatarText = <SuperWord
        input={`${lastName ? lastName?.toUpperCase() + ',' : ''}${firstName ? ' ' + setFirstName(firstName): ''}`}
        isUpper={isUpper}
    />

    return(
        <Flex className="avatar-container" align='center' gap={gap ?? 10}>
            <Avatar
                image={image}
                firstText={firstName}
                lastText={lastName}
                size={size ?? 60}
                setColor={setColor}
                onClick={link ? () => redirectTo(link) : undefined}
            />
            <Flex className="legal" vertical justify='center'>
                <span
                    className={`title ${link ? 'linked' : ''}`}
                    onClick={link ? () => redirectTo(link) : undefined}
                >
                    {avatarText}
                </span>
                {reference && <span className='mention'>{reference}</span>}
            </Flex>
        </Flex>
    )
}