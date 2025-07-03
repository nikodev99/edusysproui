import {Student} from "../../../entity";
import './student_card.scss'
import Responsive from "../../ui/layout/Responsive.tsx";
import Grid from "../../ui/layout/Grid.tsx";
import {bloodLabel, fDate} from "../../../core/utils/utils.ts";
import {Avatar} from "../../ui/layout/Avatar.tsx";
import {QRCode} from "antd";
import {text} from "../../../core/utils/text_display.ts";
import {Link} from "react-router-dom";
import {BloodType} from "../../../entity/enums/bloodType.ts";

export const GuardianStudentList = ({students}: {students?: Student[]}) => {

    console.log("STUDENT: ", students)

    return (
        <Responsive gutter={[16, 16]}>
            {students && students.map((student, index) => (
                <Grid xs={24} md={12} lg={8} xxl={6} key={index}>
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
                                <Link to={text.student.group.view.href + student.id} className="value link">
                                    <p>{student?.personalInfo?.lastName} {student?.personalInfo?.firstName}</p>
                                </Link>

                                <p className="label">ID</p>
                                <p className="value">{student.reference}</p>

                                <p className="label">Classe</p>
                                <p className="value">{student?.classe?.name}</p>

                                <p className="label">DATE DE NAISSANCE</p>
                                <p className="value">{fDate(student?.personalInfo?.birthDate)}</p>
                            </div>
                            <div className="right-section">
                                <Link to={text.student.group.view.href + student.id}>
                                    <Avatar
                                        image={student?.personalInfo?.image}
                                        firstText={student?.personalInfo?.firstName}
                                        lastText={student?.personalInfo?.lastName}
                                        size={70}
                                    />
                                </Link>
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
                                color='#FFF'
                            />
                            <Link className="qr-code-text" to={text.student.group.view.href + student.id}>{student.id}</Link>
                        </div>
                    </div>
                </Grid>
            ))}
        </Responsive>
    )
}