export type OwnedCourse = {
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

export type OwnedCourseCreateReq = {
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
};

export type OwnedCourseUpdateReq = {
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
};
