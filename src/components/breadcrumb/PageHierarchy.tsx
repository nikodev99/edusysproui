import './breadcrumb.scss'
import {Breadcrumb, Flex} from "antd";
import {LuChevronRight} from "react-icons/lu";

const PageHierarchy = ({items}: {items: object[]}) => {

    //TODO adding the navigation to the previous paths

    return(
        <Flex align={"center"} justify={"start"}>
            <Breadcrumb separator={<LuChevronRight/>} items={items} />
        </Flex>
    )
}

export default PageHierarchy