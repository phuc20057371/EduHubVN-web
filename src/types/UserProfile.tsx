type UserRole = "USER" | "LECTURER" | "SCHOOL" | "ORGANIZATION" | "ADMIN" | "SUB_ADMIN";

export type UserProfile = {
    id: string;
    email: string;
    role: UserRole;
    lastLogin: Date;
    subEmails?: string[];

    lecturer: Object | null;
    educationInstitution: Object | null;
    partnerOrganization: Object | null;

    notifications: Array<Notification>;
}