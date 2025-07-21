//  private Integer id;
//     private String organizationName;
//     private String industry;
//     private String phoneNumber;
//     private String website;
//     private String address;
//     private String representativeName;
//     private String position;
//     private String description;
//     private String logoUrl;
//     private Integer establishedYear;

//     private String adminNote;
//     private PendingStatus status;
//     private LocalDateTime createdAt;
//     private LocalDateTime updatedAt;
export type PartnerType = "UNIVERSITY" | "TRAINING_CENTER";

export type Partner = {
    id: number;
    businessRegistrationNumber: string;
    organizationName: string;
    industry: string;
    phoneNumber: string;
    website: string;
    address: string;
    representativeName: string;
    position: string;
    description: string;
    logoUrl?: string; // Optional field
    establishedYear: number | null;

    adminNote?: string; // Optional field
    status: string;
    createdAt: string;
    updatedAt: string;
};