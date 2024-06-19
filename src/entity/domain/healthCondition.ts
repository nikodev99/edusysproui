import {BloodType} from "../enums/bloodType.ts";

export interface HealthCondition {
    id?: bigint
    medicalConditions?: string[]
    allergies: string[]
    medications: string[]
    bloodType?: BloodType
    handicap?: string
    weight?: number
    height?: number
}