import {Classe, Student} from "@/entity";
import './student_card.scss'
import {bloodLabel, fDate} from "@/core/utils/utils.ts";
import {Avatar} from "@/components/ui/layout/Avatar.tsx";
import {QRCode, Space, Typography} from "antd";
import {text} from "@/core/utils/text_display.ts";
import {BloodType} from "@/entity/enums/bloodType.ts";
import {useRedirect} from "@/hooks/useRedirect.ts";

export const GuardianStudentList = ({students, allowedClasses = []}: {students?: Student[], allowedClasses?: Classe[]}) => {
    const {toViewStudent} = useRedirect()

    const {Link} = Typography

    const canViewStudent = (classe?: Classe)=> {
        return allowedClasses?.some(c => c?.id === classe?.id)
    }

    return (
        <Space wrap align='center'>
            {students && students.map((student, index) => (
                <main key={`@student-list-${index}`}>
                    <div className="card-container">
                        <div className="header">
                            <img
                                src="/edusyspro.svg" //TODO Replace it with the actual logo URL
                                alt="School Logo"
                                className="school-logo"
                            />
                            <span className="school-name">{student?.school?.name}</span>
                        </div>
                        <div className="student-info">
                            <div className="left-section">
                                <p className="label">NOM & PRENOM</p>
                                {
                                    canViewStudent(student?.classe) ? (
                                        <Link onClick={() => toViewStudent(student?.id, student?.personalInfo)} className="value link">
                                            <span>{student?.personalInfo?.lastName} {student?.personalInfo?.firstName}</span>
                                        </Link>
                                    ) : (
                                        <p>{student?.personalInfo?.lastName} {student?.personalInfo?.firstName}</p>
                                    )
                                }
                                <p className="label">ID</p>
                                <p className="value">{student?.personalInfo?.reference}</p>

                                <p className="label">Classe</p>
                                <p className="value">{student?.classe?.name}</p>

                                <p className="label">DATE DE NAISSANCE</p>
                                <p className="value">{fDate(student?.personalInfo?.birthDate)}</p>
                            </div>
                            <div className="right-section">
                                <Avatar
                                    image={student?.personalInfo?.image}
                                    firstText={student?.personalInfo?.firstName}
                                    lastText={student?.personalInfo?.lastName}
                                    size={70}
                                    onClick={canViewStudent(student?.classe) ? () => toViewStudent(student?.id, student?.personalInfo) : undefined}
                                />
                            </div>
                        </div>
                        {student.healthCondition &&
                            <div className="class-info">
                                <div className="blood-group-section">
                                    <p className="label">GROUPE SANGUIN</p>
                                    <p className="value">{bloodLabel(BloodType[student.healthCondition.bloodType as unknown as keyof typeof BloodType])}</p>
                                </div>
                            </div>
                        }
                        <div className="qr-section">
                            <QRCode
                                value={`${text.http}${text.student.group.view.href}${student.id}`}
                                errorLevel='H'
                                size={120}
                                style={{background: '#fff'}}
                                icon={"/edusyspro.svg"}
                            />
                            <Link style={{marginTop: '10px'}} className="qr-code-text" onClick={
                                canViewStudent(student?.classe)
                                    ? () => toViewStudent(student?.id, student?.personalInfo)
                                    : undefined
                            }>{student.id}</Link>
                        </div>
                    </div>
                </main>
            ))}
        </Space>
    )
}