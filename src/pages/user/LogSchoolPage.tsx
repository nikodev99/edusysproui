import {Alert, Button, Card} from "antd";
import {useAuth} from "@/hooks/useAuth.ts";
import {School} from "@/entity";
import {CSSProperties, useEffect, useMemo, useState} from "react";
import {useQueryPost} from "@/hooks/usePost.ts";
import {selectSchoolSchema} from "@/schema/models/authSchema.ts";
import {SchoolSelectionSchema} from "@/schema";
import {useGlobalStore} from "@/core/global/store.ts";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useNavigate} from "react-router-dom";

const LogSchoolPage = () => {
    const [selectedSchool, setSelectedSchool] = useState<string | undefined>(undefined)
    const {user, schoolSelection, loginError, clearLoginError} = useAuth()
    const navigate = useNavigate()
    const redirectMessage = useGlobalStore(state => state.securityRedirect)
    const setRedirectMessage = useGlobalStore(state => state.setSecurityRedirect)

    const {handleSubmit, reset} = useForm<SchoolSelectionSchema>({
        resolver: zodResolver(selectSchoolSchema)
    })

    const activeSchools = useMemo(() => user?.schools, [user?.schools])

    const {mutate} = useQueryPost(selectSchoolSchema)
    
    useEffect(() => {
        reset({
            schoolId: selectedSchool
        })
    }, [reset, selectedSchool])

    const onSubmit = (data: SchoolSelectionSchema) => {
        setRedirectMessage('')
        mutate({
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            postFn: schoolSelection,
            data: data,
        }, {
            onSuccess: () => navigate('/')
        })
    }

    const clearSecurityMessage = () => setRedirectMessage('')

    return(
        <div className='login__page__wrapper'>
            <div className="login__page__logo__wrapper">
                <img src="/edusyspro.svg" alt="logo" className="login__page__logo"/>
            </div>
            <Card title="Connexion" variant='borderless' className="login__page__card">
                {loginError?.message && (
                    <Alert
                        message={loginError.type ?? "Authentication Error"}
                        description={loginError?.message}
                        type="error"
                        showIcon
                        closable
                        onClose={clearLoginError}
                        style={{ marginBottom: 16 }}
                    />
                )}
                {redirectMessage && (
                    <Alert
                        message={"Problème de sécurité"}
                        description={redirectMessage}
                        type="info"
                        showIcon
                        closable
                        onClose={clearSecurityMessage}
                        style={{ marginBottom: 16 }}
                    />
                )}
                <h3>Choisissez l'école à laquelle se connecter</h3>
                <SelectableCard options={activeSchools} onSelect={setSelectedSchool} />
                <div style={{paddingTop: '1rem', textAlign: 'center'}}>
                    <Button type='primary' onClick={handleSubmit(onSubmit)}>Connexion</Button>
                </div>
            </Card>
        </div>
    )
}

const SelectableCard = ({ options, onSelect }: { options?: School[], onSelect: (value: string) => void }) => {
    const [selected, setSelected] = useState<string | undefined>(undefined);

    const handle = (schoolId: string) => {
        setSelected(schoolId);
        onSelect?.(schoolId);
    };

    return (
        <div style={styles.page}>
            <style>{css}</style>
            <div style={styles.grid}>
                {options && options?.map((school) => {
                    const isSelected = selected === school.id;
                    return (
                        <button
                            key={school.id}
                            className={`school-card ${isSelected ? "selected" : ""}`}
                            style={styles.card}
                            onClick={() => handle(school?.id as string)}
                            aria-pressed={isSelected}
                        >
                            <div style={{
                                ...styles.avatar,
                                background: isSelected ? "#dbeafe" : "#f0f4ff",
                            }}>
                                <span style={{
                                        ...styles.abbr,
                                        color: isSelected ? "#2563eb" : "#6b7280",
                                    }}>{school.abbr}
                                </span>
                            </div>
                            <span style={{
                                    ...styles.name,
                                    color: isSelected ? "#1d4ed8" : "#111827",
                                }}>{school.name}
                            </span>
                            {isSelected && <span style={styles.check}>✓</span>}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

const styles: Record<string, CSSProperties> = {
    page: {
        background: "#f5f6fa",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
    },
    grid: {
        display: "flex",
        flexDirection: "column",
        gap: 10,
    },
    card: {
        position: "relative",
        background: "#fff",
        border: "1.5px solid #e5e7eb",
        borderRadius: 12,
        padding: "14px 18px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 12,
        width: 280,
        textAlign: "left",
        outline: "none",
        transition: "all 0.15s ease",
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        transition: "all 0.15s ease",
    },
    abbr: {
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: "0.06em",
        fontFamily: "monospace",
        transition: "color 0.15s ease",
    },
    name: {
        fontSize: 13.5,
        fontWeight: 500,
        lineHeight: 1.4,
        flex: 1,
        transition: "color 0.15s ease",
    },
    check: {
        fontSize: 12,
        color: "#2563eb",
        fontWeight: 700,
        flexShrink: 0,
    },
};

const css = `
  .school-card:hover {
    border-color: #93c5fd !important;
    box-shadow: 0 2px 8px rgba(59,130,246,0.10);
    transform: translateY(-1px);
  }
  .school-card.selected {
    border-color: #3b82f6 !important;
    background: #eff6ff !important;
    box-shadow: 0 0 0 3px rgba(59,130,246,0.10);
  }
`;

export default LogSchoolPage;