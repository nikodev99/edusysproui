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
    slug?: string
}

export const AvatarTitle = (
    {personalInfo, image, reference, lastName, firstName, setColor, gap, size, isUpper, link, slug, toView}: AvatarTitleProps
)=>  {

    image = image ?? personalInfo?.image
    lastName = lastName ?? personalInfo?.lastName
    firstName = firstName ?? personalInfo?.firstName
    reference = reference ?? personalInfo?.reference

    const avatarText = <SuperWord
        input={`${lastName ? lastName?.toUpperCase() + ',' : ''}${firstName ? ' ' + setFirstName(firstName): ''}`}
        isUpper={isUpper}
    />

    const handleRedirect = () => {
        if (link) {
            if (slug) {
                const linkParts = link.split('/')
                const id = linkParts[linkParts.length - 1]
                const allButLast = linkParts.slice(0, -1).join('/')
                return redirectTo(`${allButLast}/${slug}`, {
                    state: id
                })
            }
            return redirectTo(link)
        }
        toView?.()
    }

    return(
        <Flex className="avatar-container" align='center' gap={gap ?? 10}>
            <Avatar
                image={image}
                firstText={firstName}
                lastText={lastName}
                size={size ?? 60}
                setColor={setColor}
                onClick={handleRedirect}
            />
            <Flex className="legal" vertical justify='center'>
                <span
                    className={`title ${link || toView ? 'linked' : ''}`}
                    onClick={handleRedirect}
                >
                    {avatarText}
                </span>
                {reference && <span className='mention'>{reference}</span>}
            </Flex>
        </Flex>
    )
}