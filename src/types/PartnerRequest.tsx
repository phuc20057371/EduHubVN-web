
export type PartnerRequest = {
    businessRegistrationNumber: string;
    organizationName: string;
    industry: string;
    phoneNumber: string;
    website: string;
    address: string;
    representativeName: string;
    position: string;
    description: string;
    logoUrl?: string; 
    establishedYear: number | null;
};