export type LecturerRequest = {
    citizenId: string;
    phoneNumber: string;
    fullName: string;
    dateOfBirth: string; // ISO date
    gender: boolean;
    bio: string;
    address: string;
    avatarUrl: string;
    academicRank: string;
    specialization: string;
    experienceYears: number;
    jobField: string;
}