import {StudentListDataType} from "@/core/utils/interfaces.ts";
import {Gender, SelectedGenderIcon} from "@/entity/enums/gender.tsx";
import {formatGrade} from "@/entity/enums/section.ts";
import Datetime from "@/core/datetime.ts";
import {ActionButton} from "@/components/ui/layout/ActionButton.tsx";
import {ItemType} from "antd/es/menu/interface";
import {Avatar} from "@/components/ui/layout/Avatar.tsx";
import {Divider} from "antd";
import {SuperWord} from "@/core/utils/tsxUtils.tsx";
import {checkAcademicYearEnded} from "@/core/utils/utils.ts";
import Tagger from "@/components/ui/layout/Tagger.tsx";
import Tag from "@/components/ui/layout/Tag.tsx";

type Palette = {
    headerGradient: string;
    avatarBg: string;
    initialsColor: string;
    genderDotBg: string;
    accentColor: string;
    accentSoft: string;
    accentBorder: string;
    statValueColor: string;
    genderTagBg: string;
    genderTagColor: string;
    genderTagBorder: string;
    genderLabel: string;
    actionBtnBg: string;
};

export const StudentCard = ({student, isArchived, redirectTo, dropdownItems}: {
    student: StudentListDataType,
    isArchived?: boolean,
    redirectTo?: (_link?: string, record?: StudentListDataType) => void,
    dropdownItems?: (url?: string, record?: StudentListDataType) => ItemType[]
}) => {

    const studentGender = Gender[student?.gender]
    const palette = getPalette(studentGender, isArchived);

    return (
        <article
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && redirectTo?.(undefined, student)}
            role="button"
            aria-label={`Fiche étudiant – ${student.firstName} ${student.lastName}`}
            style={{
                width: "100%",
                height: "100%",
                background: "#ffffff",
                overflow: "hidden",
                cursor: "pointer",
                transition: "transform .32s cubic-bezier(.22,.68,0,1.2), box-shadow .32s cubic-bezier(.22,.68,0,1.2)",
                opacity: isArchived ? 0.75 : 1,
                fontFamily: "'DM Sans', sans-serif",
                flexShrink: 0,
            }}
        >
            {/* ── Header ── */}
            <header onClick={() => redirectTo?.(undefined, student)} style={{ position: "relative", height: 108 }}>
                {/* gradient bg */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        background: palette?.headerGradient,
                        transition: "transform .5s cubic-bezier(.22,.68,0,1.2)",
                    }}
                >
                    {/* radial shine overlay */}
                    <div style={{
                        position: "absolute", inset: 0,
                        background: "radial-gradient(ellipse 140% 100% at 110% -10%, rgba(255,255,255,.12) 0%, transparent 60%)",
                    }} />
                </div>

                {/* decorative serif quote */}
                <span style={{
                    position: "absolute", fontFamily: "'Instrument Serif', serif",
                    fontStyle: "italic", color: "rgba(255,255,255,.18)",
                    fontSize: 72, lineHeight: 1, bottom: -14, right: 14,
                    userSelect: "none", pointerEvents: "none",
                }}>&ldquo;</span>

                {/* reference pill */}
                <span style={{
                    position: "absolute", top: 14, left: 16,
                    background: "rgba(255,255,255,.15)",
                    backdropFilter: "blur(6px)",
                    border: "1px solid rgba(255,255,255,.22)",
                    color: "#fff", fontSize: 10, fontWeight: 600,
                    letterSpacing: ".12em", textTransform: "uppercase",
                    padding: "3px 10px", borderRadius: 100,
                }}>{student?.reference}</span>

                {/* academic year */}
                <span style={{
                    position: "absolute", top: 14, right: 16,
                    color: "rgba(255,255,255,.75)", fontSize: 10,
                    fontWeight: 500, letterSpacing: ".08em",
                }}>{student?.academicYear?.academicYear}</span>

                {/* ── AVATAR ── */}
                <div style={{
                    position: "absolute", bottom: -38, left: "50%",
                    transform: "translateX(-50%)", zIndex: 10,
                }}>
                    <Avatar
                        image={student?.image}
                        lastText={student?.lastName}
                        firstText={student?.firstName}
                        size={90}
                        onClick={() => redirectTo?.(undefined, student)}
                        style={{border: '4px solid white'}}
                    />
                </div>
            </header>

            {/* ── Body ── */}
            <div onClick={() => redirectTo?.(undefined, student)} style={{ zIndex: -1, paddingTop: "50px", textAlign: "center" }}>

                <h2 style={{
                    fontSize: 19, letterSpacing: "-.01em",
                    color: "#0e0e0e", lineHeight: 1.2, marginBottom: 4,
                }}>
                    <em style={{ fontStyle: "italic", color: palette?.accentColor }}>
                        <SuperWord input={student.firstName.charAt(0) + student.firstName.slice(1).toLowerCase()} isSpan={true} />
                    </em>{" "}
                    <SuperWord input={student.lastName.charAt(0) + student.lastName.slice(1).toLowerCase()} isSpan={true} />
                </h2>

                <Divider />

                {/* stats row */}
                <div style={{
                    display: "flex", border: "1px solid #ebe8e3", margin: '0 18px 18px 18px',
                    borderRadius: 12, overflow: "hidden", marginBottom: 16,
                }}>
                    {[
                        { label: "Âge", value: student?.age },
                        { label: "Classe", value:student?.classe, small: true },
                        { label: "Enrol. ID", value: student?.enrollmentId, small: true },
                    ].map((cell, i) => (
                        <div
                            key={i}
                            style={{
                                flex: 1, padding: "10px 8px",
                                display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                                background: "#faf9f7",
                                borderRight: i < 2 ? "1px solid #ebe8e3" : "none",
                            }}
                        >
                            <span style={{
                                fontSize: 9.5, fontWeight: 600, letterSpacing: ".1em",
                                textTransform: "uppercase", color: "#8a8782",
                            }}>{cell.label}</span>

                            <SuperWord input={String(cell.value)} isSpan={true} style={{fontSize: cell.small ? (String(cell.value)?.length > 5 ? 13 : 16) : 16}} />
                        </div>
                    ))}
                </div>

                {/* tags */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", marginBottom: 18 }}>
                    <Tag color={palette?.accentSoft} textColor={palette?.accentColor}>{formatGrade(student?.grade)?.toUpperCase()}</Tag>
                    <Tag color={palette?.genderTagBg} textColor={palette?.genderTagColor} icon={<SelectedGenderIcon gender={student?.gender} />}>{palette?.genderLabel?.toUpperCase()}</Tag>
                    <Tagger
                        status={checkAcademicYearEnded(student?.academicYear)}
                        successMessage={'inscrit'}
                        warnMessage={'fin-année-scolaire'}
                    />
                </div>
            </div>

            {/* ── Footer ── */}
            <footer style={{
                cursor: 'default',
                borderTop: "1px solid #f0ede8",
                padding: "12px 22px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
                <div>
                    <p style={{
                        fontSize: 9.5, fontWeight: 600, letterSpacing: ".1em",
                        textTransform: "uppercase", color: "#8a8782", marginBottom: 2,
                    }}>
                        Inscrit le
                    </p>
                    <p style={{ fontSize: 11.5, fontWeight: 500, color: "#3a3a3a" }}>
                        {Datetime.of(student?.lastEnrolledDate).format({format: 'DD MMM YYYY'})}
                    </p>
                </div>

                {dropdownItems && <ActionButton
                    style={{
                        width: 34, height: 34, borderRadius: "50%",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 3,
                        background: palette?.actionBtnBg, cursor: "pointer",
                        transition: "filter .2s, transform .18s",
                        color: '#fff',
                    }}
                    arrow={true}
                    items={dropdownItems(student.id as string, student)}
                    placement="top"
                />}
            </footer>
        </article>
    );
}

const getPalette = (gender: Gender, isArchived?: boolean): Palette | undefined => {
    if (isArchived) {
        return {
            headerGradient: "linear-gradient(135deg,#3a3028 0%,#5a4a3a 55%,#7a6550 100%)",
            avatarBg: "linear-gradient(135deg,#f5efe8,#e0d0c0)",
            initialsColor: "#7a6550",
            genderDotBg: "#b5507a",
            accentColor: "#7a6550",
            accentSoft: "#f5ede8",
            accentBorder: "#dcc0b0",
            statValueColor: "#7a6550",
            genderTagBg: "#fceef5",
            genderTagColor: "#b5507a",
            genderTagBorder: "#e8c5d9",
            genderLabel: Gender.FEMME ? 'féminin' : 'masculin',
            actionBtnBg: "#7a6550",
        };
    }

    switch (gender) {
        case Gender.FEMME:
            return {
                headerGradient: "linear-gradient(135deg,#1a3c5e 0%,#1e5290 55%,#2a6dba 100%)",
                avatarBg: "linear-gradient(135deg,#fceef5,#f0d9e8)",
                initialsColor: "#b5507a",
                genderDotBg: "#b5507a",
                accentColor: "#1a3c5e",
                accentSoft: "#e8eef5",
                accentBorder: "#c5d5e8",
                statValueColor: "#1a3c5e",
                genderTagBg: "#fceef5",
                genderTagColor: "#b5507a",
                genderTagBorder: "#e8c5d9",
                genderLabel: "féminin",
                actionBtnBg: "#1a3c5e",
            };
        case Gender.HOMME:
            return {
                headerGradient: "linear-gradient(135deg,#1a3c2e 0%,#1e6244 55%,#2a8a5e 100%)",
                avatarBg: "linear-gradient(135deg,#e8f5ee,#c5dfc9)",
                initialsColor: "#1a7a45",
                genderDotBg: "#1a7a45",
                accentColor: "#1a7a45",
                accentSoft: "#e8f5ee",
                accentBorder: "#b8dfc9",
                statValueColor: "#1a7a45",
                genderTagBg: "#e8f0f5",
                genderTagColor: "#1a3c5e",
                genderTagBorder: "#b8cfe8",
                genderLabel: "masculin",
                actionBtnBg: "#1a7a45",
            }
    }
}