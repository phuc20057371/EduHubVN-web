
export type RequestLecturerFromAdmin = {
    email: string;
    password: string;

    citizenId: string;
    phoneNumber: string;
    fullName: string;
    dateOfBirth: Date;
    gender: boolean;
    bio: string;
    address: string;
    avatarUrl: string;
    academicRank: string;
    specialization: string;
    experienceYears: number;
    jobField: string;
};
