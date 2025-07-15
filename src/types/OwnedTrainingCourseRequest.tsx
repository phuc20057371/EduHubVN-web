
import type { CourseType, Scale } from "./AttendedTrainingCourseRequest";

export type OwnedTrainingCourseRequest = {
    referenceId: string;
    title: string;
    topic: string;
    organizer: string;
    courseType: CourseType;
    scale: Scale;
    startDate: string; // ISO 8601 format
    endDate: string; // ISO 8601 format
    numberOfHour: number;
    location: string;
    description: string;
    courseUrl: string;
};

export type OwnedTrainingCourseUpdateRequest = {
    id: number;
    referenceId: string;
    title: string;
    topic: string;
    organizer: string;
    courseType: CourseType;
    scale: Scale;
    startDate: string; // ISO 8601 format
    endDate: string; // ISO 8601 format
    numberOfHour: number;
    location: string;
    description: string;
    courseUrl: string;
};