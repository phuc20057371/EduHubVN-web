export type Lecturer = {
  id: string;
  citizenId: string;
  phoneNumber: string;
  fullName: string;
  dateOfBirth: string;
  gender: boolean;
  bio: string;
  address: string;
  avatarUrl: string;
  academicRank: string;
  specialization: string;
  experienceYears: number;
  jobField: string;
  adminNote: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  email?: string;
  hidden?: boolean;
}