type UserRole = "USER" | "LECTURER" | "SCHOOL" | "ORGANIZATION" | "ADMIN" | "SUB_ADMIN";

export type UserProfile = {
    id: string;
    email: string;
    role: UserRole;
    lastLogin: Date

    lecturer: Object | null;
    educationInstitution: Object | null;
    partnerOrganization: Object | null;
}