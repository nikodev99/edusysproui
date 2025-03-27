import {List, ListProps} from "antd";
import {IconText} from "../../../core/utils/tsxUtils.tsx";
import {LuCalendarDays, LuClock, LuClock9} from "react-icons/lu";
import {ReactNode} from "react";

type DataSource = {
    date?: string | string[]
    startTime?: string
    endTime?: string
    title?: ReactNode
    description?: ReactNode
    content?: ReactNode
}

type ListItemProps<TDataSource> = ListProps<TDataSource>

export const DatedListItem = (listItemProps : ListItemProps<DataSource>) => {

    const {dataSource} = listItemProps

    return(
        <List
            {...listItemProps}
            itemLayout='vertical'
            dataSource={dataSource}
            renderItem={(item, i) => (
                <List.Item key={i} actions={[
                    ...(Array.isArray(item?.date)
                            ? item.date.map((i, index) => (
                                <IconText icon={<LuCalendarDays />} text={i as string} key={`list-vertical-date-${index}`} />
                            ))
                            : item?.date ? [<IconText icon={<LuCalendarDays />} text={item.date as string} key="list-vertical-date" />] : []
                    ),
                    ...(item?.startTime ? [<IconText icon={<LuClock />} text={item.startTime} key="list-vertical-start-time" />] : []),
                    ...(item?.endTime ? [<IconText icon={<LuClock9 />} text={item.endTime} key="list-vertical-end-time" />] : [])
                ]}>
                    <List.Item.Meta
                        //TODO adding a link to the view
                        title={item?.title}
                        description={item?.description}
                    />
                    {item?.content}
                </List.Item>
            )}
        />
    )
}