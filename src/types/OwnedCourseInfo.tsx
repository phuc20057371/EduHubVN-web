export type OwnedCourse = {
  ownedCourse: {
    id: string;
    title: string;
    topic: string;
    courseType: string;
    scale: string;
    thumbnailUrl: string;
    contentUrl: string;
    level: string;
    requirements: string;
    language: string;
    isOnline: boolean;
    address: string;
    price: number;
    startDate: string;
    endDate: string;
    description: string;
    courseUrl: string;
    status: string;
    adminNote: string;
    createdAt: string;
    updatedAt: string;
  };
  lecturer: {
    id: string;
    fullName: string;
    email: string;
    avatarUrl: string;
    academicRank: string;
    specialization: string;
  };
}