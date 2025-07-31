export const getCourseType = (courseType: string): string => {
  switch (courseType) {
    case "FORMAL":
      return "Chính quy";
    case "SPECIALIZED":
      return "Chuyên đề";
    case "EXTRACURRICULAR":
      return "Ngoại khóa";
    default:
      return "Không xác định";
  }
}