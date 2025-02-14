import {Card} from "antd";
import {ReactNode} from "react";
import VoidData from "../../view/VoidData.tsx";

export interface SectionProps {
    title: string | ReactNode;
    children: ReactNode;
    more?: boolean;
    seeMore?: () => void;
}

const Section = ({title, children, more, seeMore}: SectionProps) => {

    const extra = more ? (
        <p onClick={seeMore} className="btn-toggle">
            Plus
        </p>
    ) : undefined;

    return(
        <Card className='profile-card' title={title} size='small' {...(extra && {extra})}>
            {children ?? <VoidData />}
        </Card>
    )
}

export default Section;