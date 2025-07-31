export type Course = {
  id: string;
  title: string;
  topic: string;
  courseType: string;
  scale: string;
  description: string;
  thumbnailUrl: string;
  contentUrl: string;
  level: string;
  requirements: string;
  language: string;
  isOnline: boolean;
  address: string;
  startDate: Date;
  endDate: Date;
  price: number;
  isPublished: boolean;

  createdAt: Date;
  updatedAt: Date;
};
