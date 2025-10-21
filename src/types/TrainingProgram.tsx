import type { Lecturer } from "./Lecturer";
import type { Partner } from "./Parner";
import type { UserProfile } from "./UserProfile";

export interface TrainingProgramUnit {
  id: string;
  lecturer: Lecturer;
  title: string;
  description: string;
  durationSection: number;
  orderSection: number;
  lead: boolean;
}

export interface TrainingProgramRequest {
  id: string;
  partnerOrganization: Partner;
  status: "PENDING" | "APPROVED" | "REJECTED";
  title: string;
  description: string;
  fileUrl: string;

  createdAt: Date; // ISO date string
  updatedAt: Date; // ISO date string
}

export interface TrainingProgramRequestReq {
  partnerOrganization: Partner;
  title: string;
  description: string;
  fileUrl: string;
}

export interface TrainingProgram {
  id: string;
  trainingProgramId: string;
  title: string;
  subTitle: string;
  shortDescription: string;
  description: string;
  learningObjectives: string;
  targetAudience: string;
  requirements: string;
  learningOutcomes: string;
  programStatus: "REVIEW" | "PUBLISHED" | "UNLISTED" | "ARCHIVED";
  programMode: "ONLINE" | "OFFLINE" | "HYBRID";
  programType: "SINGLE" | "PATHWAY" | "ENTERPRISE_TOPIC";
  startDate: Date; // ISO date string
  endDate: Date; // ISO date string
  durationHours: number;
  durationSessions: number;
  scheduleDetail: string;
  maxStudents: number;
  minStudents: number;
  openingCondition: string;
  equipmentRequirement: string;
  classroomLink: string;
  scale: string;
  listedPrice: number;
  internalPrice: number;
  publicPrice: number;
  priceVisible: boolean;
  bannerUrl: string;
  contentUrl: string;
  syllabusFileUrl: string;
  tags: string[];
  completionCertificateType: string;
  certificateIssuer: string;
  rating: number;
  units: Array<TrainingProgramUnit>;

  trainingProgramRequest: TrainingProgramRequest | null;
  partnerOrganization: Partner | null;
  createdAt: Date; // ISO date string
  updatedAt: Date; // ISO date string
  user: UserProfile | null;
}

export interface TrainingProgramReq {
  title: string;
  subTitle: string;
  shortDescription: string;
  description: string;
  learningObjectives: string;
  targetAudience: string;
  requirements: string;
  learningOutcomes: string;
  programStatus: "REVIEW" | "PUBLISHED" | "UNLISTED" | "ARCHIVED";
  programMode: "ONLINE" | "OFFLINE" | "HYBRID";
  programType: "SINGLE" | "PATHWAY" | "ENTERPRISE_TOPIC";
  startDate: Date; // ISO date string
  endDate: Date; // ISO date string
  durationHours: number;
  durationSessions: number;
  scheduleDetail: string;
  maxStudents: number;
  minStudents: number;
  openingCondition: string;
  equipmentRequirement: string;
  classroomLink: string;
  scale: string;
  listedPrice: number;
  internalPrice: number;
  publicPrice: number;
  priceVisible: boolean;
  bannerUrl: string;
  contentUrl: string;
  syllabusFileUrl: string;
  tags: string[];
  completionCertificateType: string;
  certificateIssuer: string;
  rating: number | null;

  trainingProgramRequest: TrainingProgramRequest | null;
  partnerOrganization: Partner | null;
  user: UserProfile | null;
}

export type LecturerUnitPublic = {
  id: string;
  fullName: string;
  gender: boolean;
  bio: string;
  avatarUrl: string;
  academicRank: string;
  specialization: string;
  experienceYears: number;
  jobField: string;
  rating: number;
};

export type TrainingProgramUnitPublic = {
  id: string;
  lecturer: LecturerUnitPublic;
  title: string;
  description: string;
  durationSection: number;
  orderSection: number;
  lead: boolean;
};
// public class TrainingProgramPublicDTO {

//     private UUID id;

//     private List<TrainingProgramUnitPublicDTO> units;

//     private TrainingProgramMode programMode;
//     private TrainingProgramType programType;

//     private LocalDate startDate;
//     private LocalDate endDate;

//     private Integer durationHours;
//     private Integer durationSessions;
//     private String scheduleDetail;

//     private String equipmentRequirement;
//     private String classroomLink;

//     private String targetAudience;
//     private String requirements;

//     private String scale;

//     private BigDecimal publicPrice;
//     private boolean isPriceVisible;

//     private String bannerUrl;
//     private String contentUrl;

//     private Set<String> tags;

//     private String learningOutcomes;

//     private String completionCertificateType;
//     private String certificateIssuer;

//     private String title;
//     private String subTitle;
//     private String shortDescription;
//     private String learningObjectives;

//     private Double rating;
// }
export type TrainingProgramPublic = {
  id: string;
  units: Array<TrainingProgramUnitPublic>;
  programMode: "ONLINE" | "OFFLINE" | "HYBRID";
  programType: "SINGLE" | "PATHWAY" | "ENTERPRISE_TOPIC";
  startDate: Date; // ISO date string
  endDate: Date; // ISO date string
  durationHours: number;
  durationSessions: number;
  scheduleDetail: string;
  equipmentRequirement: string;
  classroomLink: string;
  targetAudience: string;
  requirements: string;
  scale: string;
  publicPrice: number;
  priceVisible: boolean;
  bannerUrl: string;
  contentUrl: string;
  tags: string[];
  learningOutcomes: string;
  completionCertificateType: string;
  certificateIssuer: string;
  title: string;
  subTitle: string;
  shortDescription: string;
  learningObjectives: string;
  rating: number | null;
}
