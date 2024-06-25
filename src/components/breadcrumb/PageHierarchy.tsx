import './breadcrumb.scss'
import {Breadcrumb, Flex} from "antd";
import {LuChevronRight} from "react-icons/lu";
import {useNavigate} from "react-router-dom";
import {ReactNode} from "react";

const PageHierarchy = ({items}: {items: [{title: string | ReactNode, path?: string}]}) => {

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
        <Flex align={"center"} justify={"start"}>
            <Breadcrumb separator={<LuChevronRight />} items={breadcrumbItems} />
        </Flex>
    )
}

export default PageHierarchy