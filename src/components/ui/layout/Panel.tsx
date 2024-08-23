import Section, {SectionProps} from "./Section.tsx";

const Panel = ({title, children, seeMore}: SectionProps) => {
    return(
        <Section title={title} seeMore={seeMore}>
            <div className="panel">
                {children}
            </div>
        </Section>
    )
}

export default Panel;