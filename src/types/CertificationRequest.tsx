export type CertificationRequest = {
    referenceId: string;
    name: string;
    issuedBy: string;
    issueDate: Date;
    expiryDate: Date | null;
    certificateUrl: string;
    level: string;
    description: string;

};
