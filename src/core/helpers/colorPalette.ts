import {Gender} from "@/entity/enums/gender";
import {CardPalette} from "@/components/custom/EntityCard.tsx";
import {AssignmentTypeLiteral} from "@/entity/enums/assignmentType.ts";

export const getStudentPalette = (gender?: string, isArchived?: boolean): CardPalette => {
    if (isArchived) return {
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
        // Fixed: original compared `Gender.FEMME` (always truthy) instead of
        // the passed-in `gender`, so archived cards always showed "féminin".
        genderLabel: Gender[gender as keyof typeof Gender],
        actionBtnBg: "#7a6550",
    };

    return gender === Gender.FEMME
        ? {
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
            genderLabel: Gender.FEMME,
            actionBtnBg: "#1a3c5e",
        }
        : {
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
            genderLabel: Gender.HOMME,
            actionBtnBg: "#1a7a45",
        };
};

export const getTeacherPalette = (gender: keyof typeof Gender): CardPalette => ({
    headerGradient: "linear-gradient(135deg,#2c1f5e 0%,#4a2f8f 55%,#6d46c9 100%)",
    accentColor: "#4a2f8f",
    accentSoft: "#efe9fb",
    accentBorder: "#d8cdf0",
    statValueColor: "#4a2f8f",
    actionBtnBg: "#4a2f8f",
    genderTagBg: "#fceef5",
    genderTagColor: "#b5507a",
    genderTagBorder: "#e8c5d9",
    genderLabel: Gender[gender as keyof typeof Gender],
});

export const getEmployeePalette = (gender?: string, active?: boolean): CardPalette => {
    if (active === false) return {
        headerGradient: "linear-gradient(135deg,#3a3028 0%,#5a4a3a 55%,#7a6550 100%)",
        accentColor: "#7a6550",
        accentSoft: "#f5ede8",
        accentBorder: "#dcc0b0",
        statValueColor: "#7a6550",
        actionBtnBg: "#7a6550",
    };

    return gender === Gender.FEMME
        ? {
            headerGradient: "linear-gradient(135deg,#1a3c5e 0%,#1e5290 55%,#2a6dba 100%)",
            accentColor: "#1a3c5e",
            accentSoft: "#e8eef5",
            accentBorder: "#c5d5e8",
            statValueColor: "#1a3c5e",
            genderTagBg: "#fceef5",
            genderTagColor: "#b5507a",
            genderTagBorder: "#e8c5d9",
            genderLabel: "féminin",
            actionBtnBg: "#1a3c5e",
        }
        : {
            headerGradient: "linear-gradient(135deg,#1a3c2e 0%,#1e6244 55%,#2a8a5e 100%)",
            accentColor: "#1a7a45",
            accentSoft: "#e8f5ee",
            accentBorder: "#b8dfc9",
            statValueColor: "#1a7a45",
            genderTagBg: "#e8f0f5",
            genderTagColor: "#1a3c5e",
            genderTagBorder: "#b8cfe8",
            genderLabel: "masculin",
            actionBtnBg: "#1a7a45",
        };
};

export const getClassePalette = (): CardPalette => ({
    headerGradient: "linear-gradient(135deg,#0F172A 0%,#1E293B 55%,#334155 100%)",
    accentColor: "#0F172A",
    accentSoft: "#eef1f6",
    accentBorder: "#d7dce4",
    statValueColor: "#0F172A",
    actionBtnBg: "#0F172A",
});

export const getGuardianPalette = (gender: string): CardPalette => ({
    headerGradient: "linear-gradient(135deg,#5e3a1f 0%,#8f5a2f 55%,#c98d46 100%)",
    accentColor: "#8f5a2f",
    accentSoft: "#fbf1e9",
    accentBorder: "#ecd4b8",
    statValueColor: "#8f5a2f",
    actionBtnBg: "#8f5a2f",
    genderTagBg: Gender[gender as keyof typeof Gender] === Gender.FEMME ? "#fceef5" : "#e8f0f5",
    genderTagColor: Gender[gender as keyof typeof Gender] === Gender.FEMME ? "#b5507a" : "#1a3c5e",
    genderTagBorder: "#e8c5d9",
    genderLabel: Gender[gender as keyof typeof Gender],
});

export const getCoursePalette = (): CardPalette => ({
    headerGradient: "linear-gradient(135deg,#0e3b3f 0%,#146068 55%,#1c8a94 100%)",
    accentColor: "#146068",
    accentSoft: "#e7f4f5",
    accentBorder: "#c3e2e5",
    statValueColor: "#146068",
    actionBtnBg: "#146068",
});

export const getExamPalette = (status: AssignmentTypeLiteral): CardPalette => {
    switch (status) {
        case AssignmentTypeLiteral.SESSION_ASSIGNMENT:
            // Rose / Red (#E11D48 & #FFF1F2)
            return {
                headerGradient: "linear-gradient(135deg, #881337 0%, #BE123C 55%, #E11D48 100%)",
                accentColor: "#E11D48",
                accentSoft: "#FFF1F2",
                accentBorder: "#FECDD3",
                statValueColor: "#BE123C",
                actionBtnBg: "#E11D48",
            };

        case AssignmentTypeLiteral.CLASSROOM_ASSIGNMENT:
            // Orange (#EA580C & #FFF7ED)
            return {
                headerGradient: "linear-gradient(135deg, #7C2D12 0%, #C2410C 55%, #EA580C 100%)",
                accentColor: "#EA580C",
                accentSoft: "#FFF7ED",
                accentBorder: "#FFEDD5",
                statValueColor: "#C2410C",
                actionBtnBg: "#EA580C",
            };

        case AssignmentTypeLiteral.DEPARTMENT_ASSIGNMENT:
            // Emerald Green (#059669 & #ECFDF5)
            return {
                headerGradient: "linear-gradient(135deg, #064E3B 0%, #047857 55%, #059669 100%)",
                accentColor: "#059669",
                accentSoft: "#ECFDF5",
                accentBorder: "#A7F3D0",
                statValueColor: "#047857",
                actionBtnBg: "#059669",
            };

        case AssignmentTypeLiteral.EXAMINATION_ASSIGNMENT:
            // Royal Blue (#2563EB & #EFF6FF)
            return {
                headerGradient: "linear-gradient(135deg, #1E3A8A 0%, #1D4ED8 55%, #2563EB 100%)",
                accentColor: "#2563EB",
                accentSoft: "#EFF6FF",
                accentBorder: "#BFDBFE",
                statValueColor: "#1D4ED8",
                actionBtnBg: "#2563EB",
            };

        default:
            // Slate Gray (#4B5563 & #F9FAFB)
            return {
                headerGradient: "linear-gradient(135deg, #1E293B 0%, #334155 55%, #4B5563 100%)",
                accentColor: "#4B5563",
                accentSoft: "#F8FAFC",
                accentBorder: "#E2E8F0",
                statValueColor: "#334155",
                actionBtnBg: "#4B5563",
            };
    }
};