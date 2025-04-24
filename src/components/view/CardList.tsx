import Grid from "../ui/layout/Grid.tsx";
import {Card, Divider, Skeleton, Typography} from "antd";
import {ActionButton} from "../ui/layout/ActionButton.tsx";
import {setFirstName} from "../../core/utils/utils.ts";
import {Avatar} from "../ui/layout/Avatar.tsx";
import {ItemType} from "antd/es/menu/interface";
import {Gender, selectedGenderIcon} from "../../entity/enums/gender.tsx";
import {AiOutlineMore} from "react-icons/ai";
import {DataProps} from "../../core/utils/interfaces.ts";
import {SuperWord} from "../../core/utils/tsxUtils.tsx";

interface CardListProps {
    content: DataProps[]
    isActive: boolean
    isLoading: boolean
    dropdownItems?: (url: string) => ItemType[]
    throughDetails: (id: string) => void
    avatarLess?: boolean
    titleLevel?: 1 | 4 | 5 | 2 | 3 | undefined
    displayItem?: 1 | 2 | 3 | 4
}

const CardList = (
    {content, isActive, isLoading, dropdownItems, throughDetails, avatarLess, titleLevel, displayItem = 4}: CardListProps
) => {

    const selectedGender = (gender?: Gender) => {
        return selectedGenderIcon(gender)
    }

    const {Title, Text} = Typography
    //TODO Adding the filter by name or whatever

    const xl = displayItem === 1 ? 24 : displayItem === 2 ? 12 : displayItem === 3 ? 8 : 6
    const lg = displayItem === 1 ? 24 : displayItem === 2 ? 12 : 8
    const md = displayItem === 1 ? 24 : 12

    return(
        <>
            {
                isActive && (<Skeleton loading={isLoading} active={isLoading} avatar={isLoading}>
                    {content && content?.map(c => (
                        <Grid key={c?.id} xs={24} md={md} lg={lg} xl={xl}>
                            <Card loading={!content || isLoading} className='card__list'>
                                {dropdownItems && <ActionButton
                                    icon={<AiOutlineMore className='cardIcon' size={30} />}
                                    items={dropdownItems(c?.id as string)}
                                    placement="bottom"
                                />}
                                <div>
                                    {!avatarLess && <div className='card__avatar'>
                                        <Avatar
                                            image={c?.image}
                                            lastText={c?.lastName}
                                            firstText={c?.firstName}
                                            size={80}
                                            onClick={() => throughDetails(c?.id as string)}
                                        />
                                    </div>}
                                    <div className='col__name'>
                                        {c.lastName || c.firstName && <Title level={titleLevel ?? 4} onClick={() => throughDetails(c?.id as string)}>
                                            <SuperWord input={c.firstName ? `${c?.lastName?.toUpperCase()}, ${setFirstName(c?.firstName)}`: c.lastName as string} />
                                        </Title>}
                                        {c.reference && <Text className='st__ref'>{c?.reference}</Text>}
                                        {c?.tag && <div className='card__tag'>{c?.tag}</div>}
                                        {!c.lastName && !c.firstName ? undefined : <Divider />}
                                        {c.gender && <Text>{selectedGender(c.gender)} {c?.gender}</Text>}
                                        <Text>
                                            {c?.description && Array.isArray(c.description) ? c.description.map((d, i) => (
                                            <div className='desc' key={i}>{d}</div>
                                            )): (
                                                <div className='desc'>{c?.description}</div>
                                            )}
                                        </Text>
                                    </div>
                                </div>
                            </Card>
                        </Grid>
                    )) }

                </Skeleton>)
            }
        </>
    )
}

export default CardList