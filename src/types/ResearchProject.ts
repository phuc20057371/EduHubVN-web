export type ResearchProject = {
  id: string;
  title: string;
  researchArea: string;
  scale: string;
  startDate: string;
  endDate: string;
  foundingAmount: number;
  foundingSource: string;
  projectType: string;
  roleInProject: string;
  publishedUrl: string;
  courseStatus: string;
  description: string;
  status: string;
  adminNote: string;
  createdAt: string;
  updatedAt: string;
};

export type ResearchProjectCreateReq = {
  title: string;
  researchArea: string;
  scale: string;
  startDate: string;
  endDate: string;
  foundingAmount: number;
  foundingSource: string;
  projectType: string;
  roleInProject: string;
  publishedUrl: string;
  courseStatus: string;
  description: string;
};

export type ResearchProjectUpdateReq = {
  id: string;
  title: string;
  researchArea: string;
  scale: string;
  startDate: string;
  endDate: string;
  foundingAmount: number;
  foundingSource: string;
  projectType: string;
  roleInProject: string;
  publishedUrl: string;
  courseStatus: string;
  description: string;
};
