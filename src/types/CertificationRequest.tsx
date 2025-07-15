export type CertificationRequest = {
    referenceId: string;
    name: string;
    issuedBy: string;
    issueDate: Date;
    expiryDate: Date;
    certificateUrl: string;
    level: string;
    description: string;

};
