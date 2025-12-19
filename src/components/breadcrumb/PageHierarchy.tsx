import './breadcrumb.scss'
import {Breadcrumb, Flex} from "antd";
import {LuChevronRight} from "react-icons/lu";
import {Link} from "react-router-dom";
import {BreadcrumbType} from "../../hooks/useBreadCrumb.tsx";

export interface PageHierarchyProps {
    mBottom?: number;
    items?: BreadcrumbType[];
}

const PageHierarchy = ({items, mBottom}: PageHierarchyProps) => {

    const breadcrumbItems = items?.map((item, index) => ({
        title: item.path ? (
            <Link to={`${item.path}`} className='breadcrumb-nav' key={item.path || index} state={item.state}>
                {item.title}
            </Link>
        ) : item.setRedirect ? (
            <a onClick={item.setRedirect}>{item?.title}</a>
        ) : (
            item.title
        )
    }))

    return(
        <Flex align={"center"} justify={"start"} style={mBottom ? {marginBottom: `${mBottom}px`} : {}}>
            <Breadcrumb separator={<LuChevronRight />} items={breadcrumbItems} />
        </Flex>
    )
}

export default PageHierarchy