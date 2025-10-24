import {TableColumnsType, Tag} from "antd";
import {ActionButton} from "../../ui/layout/ActionButton.tsx";
import {Classe, Department} from "../../../entity";
import {LuDot, LuEye} from "react-icons/lu";
import ListViewer from "../../custom/ListViewer.tsx";
import {redirectTo} from "../../../context/RedirectContext.ts";
import {text} from "../../../core/utils/text_display.ts";
import {AxiosResponse} from "axios";
import {fDatetime} from "../../../core/utils/utils.ts";
import {DataProps} from "../../../core/utils/interfaces.ts";
import {SuperWord} from "../../../core/utils/tsxUtils.tsx";
import {useClasseRepo} from "../../../hooks/actions/useClasseRepo.ts";
import {AvatarTitle} from "../../ui/layout/AvatarTitle.tsx";
import {SectionType} from "../../../entity/enums/section.ts";
import {useCallback} from "react";
import {ItemType} from "antd/es/menu/interface";

export const ClasseList = ({condition}: {condition?: boolean}) => {

    const {getPaginatedClasses, getSearchedClasses} = useClasseRepo()

    const throughDetails = (link: string | number) => {
        redirectTo(`${text.cc.group.classe.view.href}${link}`)
    }

    const getItems = useCallback((url?: string): ItemType[] => {
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
    }, [])

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
        })) as DataProps<Classe>[]
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
            title: 'Departement',
            dataIndex: 'department',
            key: 'department',
            render: (department: Department) => <AvatarTitle
                firstName={department?.name}
                reference={department?.code}
                size={40}
            />
        },
        {
            title: "Niveau",
            dataIndex: ['grade', 'section'],
            key: 'grade',
            align: 'center',
            render: (text) => (<Tag color='geekblue'>{SectionType[text]}</Tag>)
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
            callback={getPaginatedClasses as () => Promise<AxiosResponse<Classe[]>>}
            searchCallback={getSearchedClasses as (input: unknown) => Promise<AxiosResponse<Classe[]>>}
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
            descMargin={{size: '10px 0'}}
        />
    )
}