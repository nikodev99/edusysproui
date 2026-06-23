import {Card} from "antd";
import {CSSProperties, ReactNode} from "react";
import VoidData from "../../view/VoidData.tsx";

export interface SectionProps {
    title: string | ReactNode;
    children: ReactNode;
    more?: boolean;
    seeMore?: () => void;
    style?: CSSProperties
}

const Section = ({title, children, more = false, seeMore, style}: SectionProps) => {

    const extra = more ? (
        <p onClick={seeMore} className="btn-toggle">
            Plus
        </p>
    ) : undefined;

    return(
        <Card style={style} className='profile-card' title={title} size='small' {...(extra && {extra})}>
            {children ?? <VoidData />}
        </Card>
    )
}

export default Section;