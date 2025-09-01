import {Planning} from "../../../entity";
import {Button, Card, Descriptions, Space} from "antd";
import {LuPen, LuTrash} from "react-icons/lu";

export const PlanningCard = ({planning}: {planning: Planning}) => {
    return (
        <Card>
            <Descriptions extra={<Space>
                <Button icon={<LuPen />} onClick={() => alert('Editer le planning')} />
                <Button icon={<LuTrash style={{color: 'red'}} />} onClick={() => alert('Supprimer le planning')} />
            </Space>} title={planning?.designation} items={[
                {label: 'Designation', children: planning.designation, span: 3},
                {label: 'Designation', children: planning.designation, span: 3},
                {label: 'Designation', children: planning.designation, span: 3},
            ]} />
        </Card>
    )
}