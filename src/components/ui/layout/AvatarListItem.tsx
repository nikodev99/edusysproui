import {Button, List, Skeleton} from "antd";
import {Avatar} from "./Avatar.tsx";
import {setFirstName} from "../../../core/utils/utils.ts";
import {ReactNode} from "react";
import {Individual} from "../../../entity/domain/individual.ts";

type AvatarListItemProps = {
    isFetching?: boolean
    showViewBtn?: boolean
    showBtnText?: ReactNode
    onBtnClick?: () => void
    isLoading?: boolean
    item?: Individual
    description?: ReactNode
}

export const AvatarListItem = (
    {isFetching, showViewBtn = true, showBtnText = 'Voir Plus', onBtnClick, isLoading = false, item, description}: AvatarListItemProps
) => {
    return(
        <List.Item actions={[
            ...(showViewBtn ? [<Button
                disabled={isFetching}
                type='link'
                key={"list-loadmore-more-" + item?.id}
                onClick={onBtnClick}
            >
                {showBtnText}
            </Button>]: [])
        ]}>
            <Skeleton avatar loading={isLoading} active={isLoading}>
                <List.Item.Meta
                    avatar={<Avatar
                        image={item?.image}
                        firstText={item?.firstName}
                        lastText={item?.lastName}
                    />}
                    title={
                        <span className='name' onClick={onBtnClick}>
                            {item?.lastName} {setFirstName(`${item?.firstName}`)}
                        </span>
                    }
                    description={description}
                />
            </Skeleton>
        </List.Item>
    )
}