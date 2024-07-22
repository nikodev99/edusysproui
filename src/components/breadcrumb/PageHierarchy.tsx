import './breadcrumb.scss'
import {Breadcrumb, Flex} from "antd";
import {LuChevronRight} from "react-icons/lu";
import {useNavigate} from "react-router-dom";
import {ReactNode} from "react";

const PageHierarchy = ({items, mBottom}: {items: [{title: string | ReactNode, path?: string}], mBottom?: number}) => {

    const navigate = useNavigate()

    const breadcrumbItems = items.map((item) => ({
        title: item.path ? (
            <span onClick={() => navigate(`${item.path}`)} className='breadcrumb-nav' key={item.path}>
                {item.title}
            </span>
        ): (
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