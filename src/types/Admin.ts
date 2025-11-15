export type CreateLecturerReq = {
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

export type CreateInstitutionReq = {
    email: string;
    password: string;

    businessRegistrationNumber: string;
    institutionName: string;
    institutionType: string;
    phoneNumber: string;
    website: string;
    address: string;
    representativeName: string;
    position: string;
    description: string;
    logoUrl: string;
    establishedYear: number;
}

export type CreatePartnerReq = {
    email: string;
    password: string;

    businessRegistrationNumber: string;
    organizationName: string;
    industry: string;
    phoneNumber: string;
    website: string;
    address: string;
    representativeName: string;
    position: string;
    description: string;
    logoUrl: string;
    establishedYear: number;

}