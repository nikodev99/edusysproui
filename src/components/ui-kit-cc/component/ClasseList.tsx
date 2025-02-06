import {TableColumnsType, Tag} from "antd";
import {ActionButton} from "../../ui/layout/ActionButton.tsx";
import {Classe} from "../../../entity";
import {LuDot, LuEye} from "react-icons/lu";
import ListViewer from "../../custom/ListViewer.tsx";
import {getAllSearchClasses} from "../../../data/repository/classeRepository.ts";
import {redirectTo} from "../../../context/RedirectContext.ts";
import {text} from "../../../utils/text_display.ts";
import {AxiosResponse} from "axios";
import {getAllSchoolClasses} from "../../../data/action/classeAction.ts";
import {fDatetime} from "../../../utils/utils.ts";
import {DataProps} from "../../../utils/interfaces.ts";
import {SuperWord} from "../../../utils/tsxUtils.tsx";

export const ClasseList = ({condition}: {condition?: boolean}) => {

    const throughDetails = (link: string) => {
        redirectTo(`${text.cc.group.classe.view.href}${link}`)
    }

    const getItems = (url: string) => {
        if (url)
            return [
                {
                    key: `details-${url}`,
                    icon: <LuEye size={20}/>,
                    label: text.cc.group.classe.view.label,
                    onClick: () => throughDetails(url)
                },
                {key: `delete-${url}`, label: 'Delete', danger: true}
            ]
        return []
    }

    const cardData = (data: Classe[]) => {
        return data?.map(c => ({
            id: c.id,
            lastName: c.name,
            reference: c.category,
            description: <div style={{
                textAlign: 'center',
            }}>
                <div style={{marginBottom: '5px'}}>Niveau Académique</div>
                <div><Tag color='geekblue'>{c.grade.section}</Tag></div>
            </div>
        })) as DataProps[]
    }

    const columns: TableColumnsType<Classe> = [
        {
            title: "Classe",
            dataIndex: 'name',
            key: 'name',
            align: 'left',
            sorter: true,
            showSorterTooltip: false,
            render: (text) => <SuperWord input={text} />
        },
        {
            title: "Category",
            dataIndex: 'category',
            key: 'category',
            align: 'center',
        },
        {
            title: "Niveau",
            dataIndex: ['grade', 'section'],
            key: 'grade',
            align: 'center',
            render: (text) => (<Tag color='geekblue'>{text}</Tag>)
            //TODO getting all the grade distinct grade and filter by grade
        },
        {
            title: "Date d'ajout",
            dataIndex: 'createdAt',
            key: 'createdAt',
            align: 'right',
            render: text => fDatetime(text, true)
        },
        {
            title: <LuDot />,
            dataIndex: 'id',
            key: 'action',
            align: 'right',
            width: '10%',
            render: (text) => (<ActionButton items={getItems(text)}/>)
        }
    ];

    return (
        <ListViewer
            callback={getAllSchoolClasses as () => Promise<AxiosResponse<Classe[]>>}
            searchCallback={getAllSearchClasses as (input: unknown) => Promise<AxiosResponse<Classe[]>>}
            tableColumns={columns}
            dropdownItems={getItems}
            throughDetails={throughDetails}
            countTitle='Classe'
            fetchId='classe-list'
            cardData={cardData}
            cardNotAvatar={true}
            localStorage={{
                activeIcon: 'classeActiveIcon'
            }}
            refetchCondition={condition}
        />
    )
}