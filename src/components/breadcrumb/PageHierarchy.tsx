import './breadcrumb.scss'
import {Breadcrumb, Flex} from "antd";
import {ChevronRight} from "lucide-react";

const PageHierarchy = ({items}: {items: object[]}) => {

    return(
        <Flex align={"center"} justify={"start"}>
            <Breadcrumb separator={<ChevronRight size={15} />} items={items} />
        </Flex>
    )
}

export default PageHierarchy