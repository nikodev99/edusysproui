import Grid from "../ui/layout/Grid.tsx";
import {Card, Skeleton, Tag} from "antd";
import ActionButton from "./ActionButton.tsx";
import Meta from "antd/es/card/Meta";
import {fDatetime, setFirstName} from "../../utils/utils.ts";
import {StudentList} from "../../utils/interfaces.ts";
import {ItemType} from "antd/es/menu/hooks/useItems";
import Avatar from "../../components/ui/layout/Avatar.tsx";

interface CardListProps {
    content?: StudentList[],
    isActive: boolean,
    isLoading: boolean,
    dropdownItems: (url: string) => ItemType[]
}

const CardList = ({content, isActive, isLoading, dropdownItems}: CardListProps) => {
    return(
        <>
            {
                isActive && (<Skeleton loading={isLoading} active={isLoading} avatar>
                    { content?.map(d => (
                        <Grid key={d.id} xs={24} md={12} lg={8} xl={6}>
                            <Card className='card__list' actions={[
                                <ActionButton items={dropdownItems(d.id)} placement='topRight' />
                            ]}>
                                <Skeleton loading={isLoading} avatar active={isLoading}>
                                    <Meta
                                        avatar={<Avatar image={d.image} lastText={d.lastName} firstText={d.firstName} />}
                                        title={<div className='col__name'>
                                            <p>{`${d.lastName.toUpperCase()}, ${setFirstName(d.firstName)}`}</p>
                                            <p className='st__ref'>{d.reference}</p>
                                            <p className='st__ref'>{d.gender.toString()}</p>
                                        </div>
                                        }
                                        description={
                                            <div className='card__desc'>
                                                <p className='desc'><Tag color='success'>inscrit</Tag></p>
                                                <p className='desc'>{`${d.grade.toString()} - ${d.classe}`}</p>
                                                <p className='desc'>Inscrit le {fDatetime(d.lastEnrolledDate, true)}</p>
                                            </div>
                                        }
                                    />
                                </Skeleton>
                            </Card>
                        </Grid>
                    ))
                    }
                </Skeleton>)
            }
        </>
    )
}

export default CardList