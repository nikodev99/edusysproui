import {Skeleton} from "antd";
import Block from "@/components/view/Block.tsx";
import {EntityCard, EntityCardProps} from "@/components/custom/EntityCard.tsx";

interface CardListProps<TData extends object> {
    content: EntityCardProps<TData>[]
    isActive: boolean
    isLoading: boolean
    displayItem?: 1 | 2 | 3 | 4 | 6
}

const CardList = <TData extends object>(
    {content, isActive, isLoading, displayItem = 4}: CardListProps<TData>
) => {

    const xl = displayItem === 1 ? 1 : displayItem === 2 ? 2 : displayItem === 3 ? 3 : displayItem === 4 ? 4 : displayItem === 6 ? 6 : 8
    const lg = displayItem === 1 ? 1 : displayItem === 2 ? 2 : 3
    const md = displayItem === 1 ? 1 : 2

    return(
        <>
            {isActive && (<Skeleton loading={isLoading} active={isLoading} avatar={isLoading}>
                <Block responsive={{xs: 1, md: md, lg: lg, xxl: xl}}>
                    {content && content?.map((c, i) => (
                        <EntityCard
                            key={`${c['id']}-${i}`}
                            id={c.id}
                            record={c?.record as TData}
                            ariaLabel={c.ariaLabel}
                            palette={c.palette}
                            header={c.header}
                            pillText={c.pillText}
                            rightText={c.rightText}
                            titlePrimary={c.titlePrimary}
                            titleSecondary={c.titleSecondary}
                            stats={c.stats}
                            tags={c.tags}
                            footerLabel={c.footerLabel}
                            footerValue={c.footerValue}
                            isDimmed={c.isDimmed}
                            redirectTo={c.redirectTo}
                            dropdown={c.dropdown}
                        />
                    ))}
                </Block>
            </Skeleton>)}
        </>
    )
}

export default CardList