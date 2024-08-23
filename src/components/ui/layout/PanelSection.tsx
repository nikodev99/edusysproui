import Section, {SectionProps} from "./Section.tsx";

const PanelSection = ({title, children, seeMore, more}: SectionProps) => {
    return(
        <Section title={title} more={more} seeMore={seeMore}>
            <div className="panel-table">
                {children}
            </div>
        </Section>
    )
}

export default PanelSection