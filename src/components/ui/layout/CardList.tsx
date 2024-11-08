import Grid from "./Grid.tsx";
import {Card, Skeleton} from "antd";
import ActionButton from "./ActionButton.tsx";
import Meta from "antd/es/card/Meta";
import {dateCompare, fDatetime, setFirstName} from "../../../utils/utils.ts";
import Avatar from "./Avatar.tsx";
import {ItemType} from "antd/es/menu/interface";
import {ReactNode, useMemo} from "react";
import {Gender} from "../../../entity/enums/gender.ts";
import {StudentListDataType} from "../../../utils/interfaces.ts";
import Tagger from "./Tagger.tsx";
import {Guardian, Teacher} from "../../../entity";
import {statusTags} from "../../../utils/tsxUtils.tsx";
import {Status} from "../../../entity/enums/status.ts";

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
                        id: c.id,
                        lastName: c.lastName,
                        firstName: c.firstName,
                        gender: c.gender,
                        image: c.image,
                        reference: c.reference,
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
                        lastName: c.personalInfo.lastName,
                        firstName: c.personalInfo.firstName,
                        gender: c.personalInfo.gender,
                        reference: c.personalInfo.emailId,
                        tag: statusTags(c.personalInfo.status as Status, c.personalInfo.gender === Gender.FEMME),
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
                        lastName: t.personalInfo.lastName,
                        firstName: t.personalInfo.firstName,
                        gender: t.personalInfo.gender,
                        reference: t.personalInfo.emailId,
                        tag: statusTags(t.personalInfo.status as Status, t.personalInfo.gender === Gender.FEMME),
                        description: t.courses && t.courses.length > 0
                            ? t.courses.map((tcc, i) => (
                                <p className='matter card' key={i}>{tcc?.course}</p>
                            ))
                            : t.classes?.map((c, i) => (
                                <p className='matter card' key={i}>{c?.name}</p>
                            ))
                    })) as DataProps[]
                }
                return [] as DataProps[]
            }
            default:
                return [] as DataProps[]
        }
    }, [cardType, content])

    return(
        <>
            {
                isActive && (<Skeleton loading={isLoading} active={isLoading} avatar>
                    {data && data?.map(c => (
                        <Grid key={c?.id} xs={24} md={12} lg={8} xl={6}>
                            <Card className='card__list' actions={[
                                <ActionButton items={dropdownItems(c?.id as string)} />
                            ]}>
                                <Skeleton loading={isLoading} avatar active={isLoading}>
                                    <Meta
                                        avatar={<Avatar image={c?.image} lastText={c?.lastName} firstText={c?.firstName} />}
                                        title={<div className='col__name'>
                                            <p onClick={() => throughDetails(c?.id as string)}>{`${c?.lastName?.toUpperCase()}, ${setFirstName(c?.firstName)}`}</p>
                                            <p className='st__ref'>{c?.reference}</p>
                                            <p className='st__ref'>{c?.gender}</p>
                                        </div>
                                        }
                                        description={
                                            <div className='card__desc'>
                                                {c?.tag && <div className='de className={} sc'>{c?.tag}</div>}
                                                {c?.description && Array.isArray(c.description) ? c.description.map((d, i) => (
                                                    <div className='desc' key={i}>{d}</div>
                                                )): (
                                                    <div className='desc'>{c?.description}</div>
                                                )}
                                            </div>
                                        }
                                    />
                                </Skeleton>
                            </Card>
                        </Grid>
                    )) }

                </Skeleton>)
            }
        </>
    )
}

export default CardList