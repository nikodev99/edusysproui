import PanelTable from "../ui/layout/PanelTable.tsx";
import {IndividualDescription} from "../ui/layout/IndividualDescription.tsx";
import {text} from "../../core/utils/text_display.ts";
import {Typography} from "antd";
import PanelSection from "../ui/layout/PanelSection.tsx";
import {Department} from "../../entity";
import {Color, ID} from "../../core/utils/interfaces.ts";
import {ReactNode} from "react";

export const DepartmentDesc = (
    {department, key = 1, color, title}: {
        department: Department,
        key?: ID,
        color?: Color,
        title?: ReactNode
    }
) => {
    return(
        <PanelSection key={key} title={title ?? `Membre du Department ${department.code}`}>
            <PanelTable title='Organisation Departementale' data={[
                {statement: 'Department', response: department.name},
                {statement: 'Code', response: department.code},
            ]} panelColor={color} />
            <IndividualDescription
                personalInfo={department?.boss?.d_boss}
                show={department?.boss?.d_boss === undefined}
                redirectLink={text.teacher.group.view.href + department.boss?.d_boss?.id}
                titles={{panel: 'Chef de department'}}
                color={color}
                period={department.boss?.startPeriod}
                isCurrent={department?.boss?.current}
            />
            {department?.purpose ? <PanelTable title='Objectif' panelColor={color} data={[
                {response: <div style={{padding: '5px'}}>
                    <Typography.Text>{department?.purpose}</Typography.Text>
                </div>, tableRow: true}
            ]} /> : null}
        </PanelSection>
    )
}