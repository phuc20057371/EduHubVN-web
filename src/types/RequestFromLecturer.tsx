import type { Lecturer } from "./Lecturer";


export type RequestFromLecturer = {
  content: any;
  lecturerInfo: Lecturer;
  type: string;
  label: string;
  date: Date;
};
