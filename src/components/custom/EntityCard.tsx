import {ReactNode} from "react";
import {Avatar} from "@/components/ui/layout/Avatar.tsx";
import {SuperWord} from "@/core/utils/tsxUtils.tsx";
import {Divider} from "antd";
import {ID} from "@/core/utils/interfaces.ts";

export type CardPalette = {
    // Actively consumed by EntityCard
    headerGradient: string;
    accentColor: string;
    accentSoft: string;
    accentBorder: string;
    statValueColor: string;
    actionBtnBg: string;

    // Pass-through — not consumed inside EntityCard (weren't consumed in
    // the original StudentCard render either). Available to you at the
    // call site, e.g. for Avatar fallback styling or a Tag border prop.
    avatarBg?: string;
    initialsColor?: string;
    genderDotBg?: string;

    // Gender-tag styling — only meaningful for person-type entities.
    // Built into the `tags` array by the caller, not read by EntityCard.
    genderTagBg?: string;
    genderTagColor?: string;
    genderTagBorder?: string;
    genderLabel?: string;
};

export type EntityCardStat = {
    label: string;
    value: ReactNode;
    small?: boolean;
};

export type EntityCardHeader =
    | { type: "avatar"; image?: string; firstText?: string; lastText?: string }
    | { type: "icon"; icon: ReactNode; background?: string };

export interface EntityCardProps<T extends object> {
    id: ID;
    record: T
    palette: CardPalette;
    header: EntityCardHeader;
    titlePrimary: string;
    titleSecondary?: string;
    pillText?: ReactNode;
    rightText?: ReactNode;
    stats?: EntityCardStat[];
    tags?: ReactNode[];
    footerLabel?: string;
    footerValue?: ReactNode;
    isDimmed?: boolean;
    ariaLabel?: string;
    dropdown?: ReactNode
    avatarSize?: number
    redirectTo?: (id?: string, record?: T) => void;
}

export const EntityCard = <T extends object>(
    {
        id, record, palette, header, titlePrimary, titleSecondary, pillText, rightText, stats, tags, footerLabel, footerValue,
        isDimmed, ariaLabel, redirectTo, dropdown, avatarSize = 100
    }: EntityCardProps<T>) => {

    const goTo = () => redirectTo?.(id as string, record);
    const hasFooterContent = footerLabel || footerValue;
    const hasFooter = hasFooterContent || dropdown;

    return (
        <article
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && goTo()}
            role="button"
            aria-label={ariaLabel}
            style={{
                width: "100%", height: "100%", background: "#ffffff", overflow: "hidden",
                cursor: "pointer", opacity: isDimmed ? 0.75 : 1,
                flexShrink: 0,
                transition: "transform .32s cubic-bezier(.22,.68,0,1.2), box-shadow .32s cubic-bezier(.22,.68,0,1.2)",
            }}
        >
            {/* ── Header ── */}
            <header onClick={goTo} style={{position: "relative", height: 108}}>
                <div style={{position: "absolute", inset: 0, background: palette.headerGradient}}>
                    <div style={{
                        position: "absolute", inset: 0,
                        background: "radial-gradient(ellipse 140% 100% at 110% -10%, rgba(255,255,255,.12) 0%, transparent 60%)",
                    }}/>
                </div>

                <span style={{
                    position: "absolute", fontStyle: "italic",
                    color: "rgba(255,255,255,.18)", fontSize: 72, lineHeight: 1, bottom: -14, right: 14,
                    userSelect: "none", pointerEvents: "none",
                }}>&ldquo;</span>

                {pillText && <span style={{
                    position: "absolute", top: 14, left: 16, background: "rgba(255,255,255,.15)",
                    backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,.22)",
                    color: "#fff", fontSize: 10, fontWeight: 600, letterSpacing: ".12em",
                    textTransform: "uppercase", padding: "3px 10px", borderRadius: 100,
                }}>{pillText}</span>}

                {rightText && <span style={{
                    position: "absolute", top: 14, right: 16, color: "rgba(255,255,255,.75)",
                    fontSize: 10, fontWeight: 500, letterSpacing: ".08em",
                }}>{rightText}</span>}

                <div style={{position: "absolute", bottom: -38, left: "50%", transform: "translateX(-50%)", zIndex: 10}}>
                    {header.type === "avatar" ? (
                        <Avatar
                            image={header.image}
                            firstText={header.firstText}
                            lastText={header.lastText}
                            size={avatarSize}
                            onClick={goTo}
                            style={{border: "4px solid white"}}
                        />
                    ) : (
                        <div onClick={goTo} style={{
                            width: 90, height: 90, borderRadius: "50%",
                            background: header.background ?? palette.accentSoft,
                            border: "4px solid white", display: "flex",
                            alignItems: "center", justifyContent: "center",
                        }}>
                            {header.icon}
                        </div>
                    )}
                </div>
            </header>

            {/* ── Body ── */}
            <div style={{zIndex: -1, paddingTop: "50px", textAlign: "center"}}>
                <h2 onClick={goTo} style={{fontSize: 19, letterSpacing: "-.01em", color: "#0e0e0e", lineHeight: 1.2, marginBottom: 4}}>
                    {titleSecondary ? (
                        <>
                            <em style={{fontStyle: "italic", color: palette.accentColor}}>
                                <SuperWord input={titlePrimary} isSpan={true}/>
                            </em>{" "}
                            <SuperWord input={titleSecondary} isSpan={true}/>
                        </>
                    ) : (
                        <SuperWord input={titlePrimary} isSpan={true}/>
                    )}
                </h2>

                <Divider/>

                {!!stats?.length && (
                    <div style={{
                        display: "flex", border: `1px solid ${palette.accentBorder}`, margin: "0 10px 10px 10px",
                        borderRadius: 12, overflow: "hidden",
                    }}>
                        {stats.map((cell, i) => (
                            <div key={i} style={{
                                flex: 1, padding: "10px 8px", display: "flex", flexDirection: "column",
                                alignItems: "center", gap: 2, background: "#faf9f7",
                                borderRight: i < stats.length - 1 ? `1px solid ${palette.accentBorder}` : "none",
                            }}>
                                <span style={{
                                    fontSize: 9.5, fontWeight: 600, letterSpacing: ".1em",
                                    textTransform: "uppercase", color: "#8a8782",
                                }}>{cell.label}</span>
                                <SuperWord
                                    input={String(cell.value)}
                                    isSpan={true}
                                    style={{
                                        fontSize: cell.small ? (String(cell.value)?.length > 5 ? 13 : 16) : 16,
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                )}

                {!!tags?.length && (
                    <div style={{display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", marginBottom: 18}}>
                        {tags.map((tag, i) => <span key={i}>{tag}</span>)}
                    </div>
                )}
            </div>

            {/* ── Footer ── */}
            {hasFooter && (
                <footer style={{
                    cursor: "default", borderTop: "1px solid #f0ede8", padding: "12px 22px",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                }}>
                    <div>
                        {footerLabel && <p style={{
                            fontSize: 9.5, fontWeight: 600, letterSpacing: ".1em",
                            textTransform: "uppercase", color: "#8a8782", marginBottom: 2,
                        }}>{footerLabel}</p>}
                        {footerValue && <p style={{fontSize: 11.5, fontWeight: 500, color: "#3a3a3a"}}>{footerValue}</p>}
                    </div>

                    {dropdown && dropdown}
                </footer>
            )}
        </article>
    );
};