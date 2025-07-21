export type EducationInstitutionType = "UNIVERSITY" | "TRAINING_CENTER" ;


export type InstitutionRequest = {
    businessRegistrationNumber: string;
    institutionName: string;
    institutionType: EducationInstitutionType;
    phoneNumber: string;
    website: string;
    address: string;
    representativeName: string;
    position: string;
    description: string;
    establishedYear: number | null;
    logoUrl?: string; // Optional field
};