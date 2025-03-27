import PanelTable from "./PanelTable.tsx";
import {Flex} from "antd";
import {AvatarTitle} from "./AvatarTitle.tsx";
import {SwitchTag} from "./SwitchTag.tsx";
import PanelSection from "./PanelSection.tsx";
import {Color} from "../../../core/utils/interfaces.ts";
import {ReactNode} from "react";
import {Individual} from "../../../entity/domain/individual.ts";
import Datetime from "../../../core/datetime.ts";

interface IndividualProps {
    personalInfo?: Individual
    show: boolean
    color?: Color
    titles?: Partial<{
        main?:  ReactNode | string | undefined,
        panel?: ReactNode | string | undefined,
    }>
    redirectLink?: string,
    period?: number[]
    isCurrent?: boolean
}

export const IndividualDescription = (
    {personalInfo, show, titles, color, redirectLink, period, isCurrent}: IndividualProps
) => {

    const TablePanel = <PanelTable title={titles?.panel} data={[
        ...(!show ? [
            {
                statement: 'Nom(s), Prénom(s)',
                response: <Flex justify='center'>
                    <AvatarTitle
                        lastName={personalInfo?.lastName}
                        firstName={personalInfo?.firstName}
                        image={personalInfo?.image}
                        gap={5} size={35}
                    />
                </Flex>,
                link: redirectLink
            },
            {statement: 'Debut de mandat', response: <span>{Datetime?.of(period as number[]).fDate('DD/MM/YYYY')}</span>},
            {
                statement: 'Status',
                response: <SwitchTag
                    mustSwitch={isCurrent ?? false}
                    texts={{success: 'Mandat en cours', failed: 'Mandat terminé'}}
                />
            }
        ] : [])
    ]} panelColor={color} />

    return <>
        {
            titles && titles?.main !== undefined
                ? <PanelSection title={titles?.main}>{TablePanel}</PanelSection>
                : TablePanel
        }
    </>
}