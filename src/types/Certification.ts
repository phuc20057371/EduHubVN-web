export type Certification = {
  id: string;
  referenceId: string;
  name: string;
  issuedBy: string;
  issueDate: string;
  expiryDate: string;
  certificateUrl: string;
  level: string;
  description: string;
  adminNote: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type CertificationCreateReq = {
  referenceId: string;
  name: string;
  issuedBy: string;
  issueDate: Date;
  expiryDate: Date | null;
  certificateUrl: string;
  level: string;
  description: string;
};

export type CertificationUpdateReq = {
  id: string;
  referenceId: string;
  name: string;
  issuedBy: string;
  issueDate: Date;
  expiryDate: Date | null;
  certificateUrl: string;
  level: string;
  description: string;
};