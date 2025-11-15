export type PartnerType = "UNIVERSITY" | "TRAINING_CENTER";

export type Partner = {
  id: string;
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

export type PartnerCreateReq = {
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


export type PartnerUpdateReq = {
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