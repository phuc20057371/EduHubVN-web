import type { Certification } from "./Certification";
import type { Degree } from "./Degree";

export type Lecturer = {
  id: string;
  lecturerId: string;
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

export type LecturerCreateReq = {
  citizenId: string;
  phoneNumber: string;
  fullName: string;
  dateOfBirth: string; // ISO date
  gender: boolean;
  bio: string;
  address: string;
  avatarUrl: string;
  academicRank: string;
  specialization: string;
  experienceYears: number;
  jobField: string;
}

export type LecturerBasicPublic = {
  id: String;
  fullName: String;
  gender: Boolean;
  bio: String;
  avatarUrl: String;
  academicRank: String;
  specialization: String;
  experienceYears: Number;
  jobField: String;
  rating?: Number;
  status: String;
  createdAt: String;
  updatedAt: String;

  degrees?: Array<Degree>;
  certifications?: Array<Certification>;

}

export type RequestFromLecturer = {
  content: any;
  lecturerInfo: Lecturer;
  type: string;
  label: string;
  date: Date;
};