import {Button, Carousel} from "antd";
import {Avatar} from "../ui/layout/Avatar.tsx";
import {lowerName} from "../../core/utils/utils.ts";
import Section from "../ui/layout/Section.tsx";
import {Enrollment} from "../../entity";
import {Color} from "../../core/utils/interfaces.ts";
import {ReactNode} from "react";

export const StudentCarousel = (
    {students, redirectTo, color, seeMore, btnLabel, title}: {
        students: Enrollment[]
        seeMore: () => void
        redirectTo?: (id: string) => void
        color?: Color
        btnLabel?: string
        title?: ReactNode
    }
) => {

    const handleRedirect = (id: string) => {
        redirectTo && redirectTo(id)
    }

    return(
        <Section title={title ?? 'Condisciples'} more={true} seeMore={seeMore}>
            <Carousel slidesToShow={3} slidesToScroll={1} dots={false} arrows draggable autoplay>
                {students && students.map((c, i) => (<div className='classmate-team' key={`${c.student.id}-${i}`}>
                    <div className='scroll-box'>
                        <a onClick={() => handleRedirect(c?.student?.id)}>
                            <div className='avatar'>
                                <Avatar
                                    image={c.student?.personalInfo?.image}
                                    size={{xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100}}
                                    firstText={c.student?.personalInfo?.firstName} lastText={c.student?.personalInfo?.lastName}
                                />
                            </div>
                            <div className='name'>
                                <span>{lowerName(c.student?.personalInfo?.firstName as string, c.student?.personalInfo?.lastName)}</span>
                            </div>
                        </a>
                        <div className='view__button'>
                            <Button style={{width: '100%', background: color}} onClick={() => handleRedirect(c.student.id)}>
                                {btnLabel ?? 'Voir'}
                            </Button>
                        </div>
                    </div>

                </div>))}
            </Carousel>
        </Section>
    )
}