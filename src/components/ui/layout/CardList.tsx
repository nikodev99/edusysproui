import Grid from "./Grid.tsx";
import {Card, Divider, Flex, Skeleton, Tag, Typography} from "antd";
import ActionButton from "./ActionButton.tsx";
import {dateCompare, fDatetime, setFirstName} from "../../../utils/utils.ts";
import Avatar from "./Avatar.tsx";
import {ItemType} from "antd/es/menu/interface";
import {ReactNode, useMemo} from "react";
import {Gender, selectedGenderIcon} from "../../../entity/enums/gender.tsx";
import {StudentListDataType} from "../../../utils/interfaces.ts";
import Tagger from "./Tagger.tsx";
import {Guardian, Teacher} from "../../../entity";
import {statusTags} from "../../../utils/tsxUtils.tsx";
import {Status} from "../../../entity/enums/status.ts";
import {AiOutlineMore} from "react-icons/ai";

interface CardListProps<TData> {
    content: TData,
    isActive: boolean,
    isLoading: boolean,
    dropdownItems: (url: string) => ItemType[],
    throughDetails: (id: string) => void
    cardType?: string
}

interface DataProps {
    id?: string | number
    lastName?: string
    firstName?: string
    gender?: Gender
    image?: string
    reference?: string
    tag?: string | ReactNode
    description?: string | ReactNode | string[] | ReactNode[]
}

const CardList = <TData extends object>({content, isActive, isLoading, dropdownItems, throughDetails, cardType}: CardListProps<TData>) => {

    const data: DataProps[] = useMemo((): DataProps[] => {
        switch (cardType) {
            case 'student': {
                if (content) {
                    const data: StudentListDataType[] = content as StudentListDataType[]
                    return data.map(c => ({
                        id: c?.id,
                        lastName: c?.lastName,
                        firstName: c?.firstName,
                        gender: c?.gender,
                        image: c?.image,
                        reference: c?.reference,
                        tag: <Tagger status={dateCompare(c?.academicYear?.endDate as Date)} successMessage='inscrit'
                                     warnMessage='fin_annee_scolaire'/>,
                        description: [
                            `${c.grade} - ${c.classe}`,
                            `Inscrit le, ${fDatetime(c.lastEnrolledDate, true)}`
                        ]
                    })) as DataProps[]
                }
                return [] as DataProps[]
            }
            case 'guardian': {
                if (content) {
                    const data: Guardian[] = content as Guardian[]
                    return data.map(c => ({
                        id: c.id,
                        lastName: c.personalInfo?.lastName,
                        firstName: c.personalInfo?.firstName,
                        gender: c.personalInfo?.gender,
                        reference: c.personalInfo?.emailId,
                        tag: statusTags(c.personalInfo?.status as Status, c.personalInfo?.gender === Gender.FEMME),
                        description: []
                    })) as DataProps[]
                }
                return [] as DataProps[]
            }
            case 'teacher': {
                if (content) {
                    const data: Teacher[] = content as Teacher[]
                    return data.map(t => ({
                        id: t.id,
                        lastName: t?.personalInfo?.lastName,
                        firstName: t?.personalInfo?.firstName,
                        gender: t?.personalInfo?.gender,
                        reference: t?.personalInfo?.emailId,
                        tag: statusTags(t?.personalInfo?.status as Status, t?.personalInfo?.gender === Gender.FEMME),
                        description: <>
                            <Divider style={{fontSize: '12px'}}>Cours ou classes</Divider>
                            <Flex gap={2} wrap justify={"center"}>
                                {(t.courses && t.courses.length > 0
                                ? t.courses.map((tcc) => tcc?.course).filter(Boolean)
                                : t.classes?.map((c) => c?.name).filter(Boolean) ?? []).map((item, index) => (
                                    <Tag key={index}>{item}</Tag>
                                ))}
                            </Flex>
                        </>
                    })) as DataProps[]
                }
                return [] as DataProps[]
            }
            default:
                return [] as DataProps[]
        }
    }, [cardType, content])

    const selectedGender = (gender?: Gender) => {
        return selectedGenderIcon(gender)
    }

    const {Title, Text} = Typography
    //TODO Adding the filter by name or whatever

    return(
        <>
            {
                isActive && (<Skeleton loading={isLoading} active={isLoading} avatar={isLoading}>
                    {data && data?.map(c => (
                        <Grid key={c?.id} xs={24} md={12} lg={8} xl={6}>
                            <Card loading={!content || isLoading} className='card__list'>
                                <ActionButton
                                    icon={<AiOutlineMore className='cardIcon' size={30} />}
                                    items={dropdownItems(c?.id as string)}
                                    placement="bottom"
                                />
                                <div>
                                    <div className='card__avatar'>
                                        <Avatar
                                            image={c?.image}
                                            lastText={c?.lastName}
                                            firstText={c?.firstName}
                                            size={80}
                                            onClick={() => throughDetails(c?.id as string)}
                                        />
                                    </div>
                                    <div className='col__name'>
                                        <Title level={4} onClick={() => throughDetails(c?.id as string)}>
                                            {`${c?.lastName?.toUpperCase()}, ${setFirstName(c?.firstName)}`}
                                        </Title>
                                        <Text className='st__ref'>{c?.reference}</Text>
                                        {c?.tag && <div className='card__tag'>{c?.tag}</div>}
                                        <Divider />
                                        <Text>{selectedGender(c.gender)} {c?.gender}</Text>
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