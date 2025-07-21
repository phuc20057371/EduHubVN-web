//  private Integer id;
//     private String businessRegistrationNumber;
//     private String institutionName;
//     private EducationInstitutionType institutionType;
//     private String phoneNumber;
//     private String website;
//     private String address;
//     private String representativeName;
//     private String position;
//     private String description;
//     private String logoUrl;
//     private Integer establishedYear;

//     private String adminNote;
//     private PendingStatus status;
//     private LocalDateTime createdAt;
//     private LocalDateTime updatedAt;

export type Institution = {
  id: number;
  businessRegistrationNumber: string;
  institutionName: string;
  institutionType: string;
  phoneNumber: string;
  website: string;
  address: string;
  representativeName: string;
  position: string;
  description: string;
  logoUrl: string;
  establishedYear: number;
  adminNote: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};