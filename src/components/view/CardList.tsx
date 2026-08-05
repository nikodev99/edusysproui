import {Card, Divider, Skeleton, Typography} from "antd";
import {ActionButton} from "@/components/ui/layout/ActionButton.tsx";
import {setFirstName} from "@/core/utils/utils.ts";
import {Avatar} from "@/components/ui/layout/Avatar.tsx";
import {ItemType} from "antd/es/menu/interface";
import {Gender, SelectedGenderIcon} from "@/entity/enums/gender.tsx";
import {AiOutlineMore} from "react-icons/ai";
import {DataProps} from "@/core/utils/interfaces.ts";
import {SuperWord} from "@/core/utils/tsxUtils.tsx";
import Block from "@/components/view/Block.tsx";

interface CardListProps<TData extends object> {
    content: DataProps<TData>[]
    isActive: boolean
    isLoading: boolean
    dropdownItems?: (url?: string, record?: TData) => ItemType[]
    throughDetails?: (id: string, record?: TData) => void
    avatarLess?: boolean
    titleLevel?: 1 | 4 | 5 | 2 | 3
    displayItem?: 1 | 2 | 3 | 4 | 6
    onSelectData?: (data: never) => void
}

const CardList = <TData extends object>(
    {content, isActive, isLoading, dropdownItems, throughDetails, onSelectData, avatarLess, titleLevel = 4, displayItem = 4}: CardListProps<TData>
) => {

    const selectedGender = (gender?: Gender) => {
        return <SelectedGenderIcon gender={gender} />
    }

    const {Title, Paragraph, Text} = Typography
    //TODO Adding the filter by name or whatever

    const xl = displayItem === 1 ? 1 : displayItem === 2 ? 2 : displayItem === 3 ? 3 : displayItem === 4 ? 4 : displayItem === 6 ? 6 : 8
    const lg = displayItem === 1 ? 1 : displayItem === 2 ? 2 : 3
    const md = displayItem === 1 ? 1 : 2

    return(
        <>
            {
                isActive && (<Skeleton loading={isLoading} active={isLoading} avatar={isLoading}>
                    <Block responsive={{xs: 1, md: md, lg: lg, xxl: xl}}>
                        {content && content?.map(c => (
                            <Card key={c.id} loading={!content || isLoading} className='card__list' onClick={() => onSelectData?.(c?.record as never)} styles={{
                                body: {
                                    padding: c.bodyLess ? 0 : 24
                                }
                            }}>
                                {dropdownItems && c.lastName && <ActionButton
                                    icon={<AiOutlineMore className='cardIcon' size={30} />}
                                    items={dropdownItems(c.id as string, c.record)}
                                    placement="bottom"
                                />}
                                <div>
                                    {!avatarLess && <div className='card__avatar'>
                                        <Avatar
                                            image={c?.image}
                                            lastText={c?.lastName}
                                            firstText={c?.firstName}
                                            size={80}
                                            onClick={() => throughDetails?.(c?.id as string, c?.record)}
                                        />
                                    </div>}
                                    <div className='col__name'>
                                        {c.lastName !== undefined && <Title level={titleLevel} onClick={() => throughDetails?.(c?.id as string, c?.record)}>
                                            <SuperWord input={c.firstName ? `${c?.lastName?.toUpperCase()}, ${setFirstName(c?.firstName)}`: c.lastName as string} />
                                        </Title>}
                                        {c.reference && <Text className='st__ref'>{c?.reference}</Text>}
                                        {c?.tag && <div className='card__tag'>{c?.tag}</div>}
                                        {!c.lastName && !c.firstName ? undefined : <Divider />}
                                        {c.gender && <Text>{selectedGender(c.gender)} {c?.gender}</Text>}
                                        <Paragraph>
                                            {c?.description && Array.isArray(c.description) ? c.description.map((d, i) => (
                                            <div className='desc' key={i}>{d}</div>
                                            )): (
                                                <div className='desc'>{c?.description}</div>
                                            )}
                                        </Paragraph>
                                    </div>
                                </div>
                            </Card>

                        ))}
                    </Block>
                </Skeleton>)
            }
        </>
    )
}

export default CardList