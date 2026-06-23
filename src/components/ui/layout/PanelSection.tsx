import Section, {SectionProps} from "./Section.tsx";

const PanelSection = ({title, children, seeMore, more, style}: SectionProps) => {
    return(
        <Section style={style} title={title} more={more} seeMore={seeMore}>
            <div className="panel-table">
                {children}
            </div>
        </Section>
    )
}

export default PanelSection