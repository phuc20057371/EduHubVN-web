// public enum Scale {
//     INSTITUTIONAL,   // Institutional level
//     UNIVERSITY,       // University level
//     DEPARTMENTAL,     // Department or provincial level
//     MINISTERIAL,      // Ministry level
//     NATIONAL,         // National level
//     INTERNATIONAL     // International level
// }

export type CourseType = 'FORMAL' | 'SPECIALIZED' | 'EXTRACURRICULAR';
export type Scale =  'INSTITUTIONAL' | 'UNIVERSITY' | 'DEPARTMENTAL' | 'MINISTERIAL' | 'NATIONAL' | 'INTERNATIONAL';

export type AttendedTrainingCourseRequest = {
    referenceId: string;
    title: string;
    topic: string;
    organizer: string;
    courseType: CourseType; // Assuming CourseType is a string enum
    scale: Scale; // Assuming Scale is a string enum
    startDate: string; // ISO 8601 format
    endDate: string; // ISO 8601 format
    numberOfHour: number;
    location: string;
    description: string;
    courseUrl: string;
}

export type AttendedTrainingCourseUpdateRequest = {
    id: number;
    referenceId: string;
    title: string;
    topic: string;
    organizer: string;
    courseType: CourseType;
    scale: Scale; 
    startDate: string; 
    endDate: string; 
    numberOfHour: number; 
    location: string; 
    description: string; 
    courseUrl: string; 
}