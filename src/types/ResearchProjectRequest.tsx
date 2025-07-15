
import type { Scale } from "./AttendedTrainingCourseRequest";
export type ProjectType = 'RESEARCH' | 'TOPIC' | 'PROJECT';
export type ResearchProjectRequest = {
    referenceId: string;
    title: string;
    researchArea: string;
    scale: Scale;
    startDate: string; // ISO 8601 format
    endDate: string; // ISO 8601 format
    foundingAmount: number;
    foundingSource: string;
    projectType: ProjectType;
    roleInProject: string;
    publishedUrl: string;
    courseStatus: string;
    description: string;
};
export type ResearchProjectUpdateRequest = {
    id: number;
    referenceId: string;
    title: string;
    researchArea: string;
    scale: Scale;
    startDate: string; // ISO 8601 format
    endDate: string; // ISO 8601 format
    foundingAmount: number;
    foundingSource: string;
    projectType: ProjectType;
    roleInProject: string;
    publishedUrl: string;
    courseStatus: string;
    description: string;
};
