import Grid from "./Grid.tsx";
import {Card, Skeleton} from "antd";
import ActionButton from "./ActionButton.tsx";
import Meta from "antd/es/card/Meta";
import {setFirstName} from "../../../utils/utils.ts";
import Avatar from "./Avatar.tsx";
import {ItemType} from "antd/es/menu/interface";
import {ReactNode} from "react";
import {Gender} from "../../../entity/enums/gender.ts";

interface CardListProps {
    content: {
        id?: string | number
        lastName?: string
        firstName?: string
        gender?: Gender
        image?: string
        reference?: string
        tag?: string | ReactNode
        description?: string | ReactNode | string[] | ReactNode[]
    }[],
    isActive: boolean,
    isLoading: boolean,
    dropdownItems: (url: string) => ItemType[],
    throughDetails: (id: string) => void
}

const CardList = ({content, isActive, isLoading, dropdownItems, throughDetails}: CardListProps) => {
    return(
        <>
            {
                isActive && (<Skeleton loading={isLoading} active={isLoading} avatar>
                    {content && content.map(c => (
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
                                                {c?.tag && <p className='desc'>{c?.tag}</p>}
                                                {c?.description && Array.isArray(c.description) ? c.description.map((d, i) => (
                                                    <p className='desc' key={i}>{d}</p>
                                                )): (
                                                    <p className='desc'>{c?.description}</p>
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