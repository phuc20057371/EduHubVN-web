
export type CertificationUpdateRequest = {
    id: string;
    referenceId: string;
    name: string;
    issuedBy: string;
    issueDate: string; // ISO 8601 format
    expiryDate: string; // ISO 8601 format
    certificateUrl: string;
    level: string;
    description: string;
};