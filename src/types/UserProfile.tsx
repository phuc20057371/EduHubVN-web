type UserRole = "USER" | "LECTURER" | "SCHOOL" | "ORGANIZATION" | "ADMIN";

export type UserProfile = {
    id: number;
    email: string;
    role: UserRole;
    lastLogin: Date

    lecturer: Object | null;
    educationInstitution: Object | null;
    partnerOrganization: Object | null;
}