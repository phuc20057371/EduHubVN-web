export type Degree = {
  id: string;
  referenceId: string;
  name: string;
  major: string;
  institution: string;
  startYear: number;
  graduationYear: number;
  level: string;
  url: string;
  description: string;
  adminNote: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type DegreeCreateReq = {
  referenceId: string;
  name: string;
  major: string;
  institution: string;
  startYear: number;
  graduationYear: number;
  level: string;
  url: string;
  description: string;
};

export type DegreeUpdateReq = {
  id: string;
  referenceId: string;
  name: string;
  major: string;
  institution: string;
  startYear: number;
  graduationYear: number;
  level: string;
  url: string;
  description: string;
};
