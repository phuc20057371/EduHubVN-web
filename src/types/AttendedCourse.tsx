export type AttendedCourse = {
  id: string;
  title: string;
  topic: string;
  organizer: string;
  courseType: string;
  scale: string;
  startDate: string;
  endDate: string;
  numberOfHour: number;
  location: string;
  description: string;
  courseUrl: string;
  status: string;
  adminNote: string;
  createdAt: string;
  updatedAt: string;
};

export type AttendedCourseRequest = {
  title: string;
  topic: string;
  organizer: string;
  courseType: string;
  scale: string;
  startDate: string;
  endDate: string;
  numberOfHour: number;
  location: string;
  description: string;
  courseUrl: string;
};
