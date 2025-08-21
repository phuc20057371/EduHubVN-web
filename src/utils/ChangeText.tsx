export const getAcademicRankLabel = (rank: string) => {
  switch (rank) {
    case "CN":
      return "Cử nhân";
    case "THS":
      return "Thạc sĩ";
    case "TS":
      return "Tiến sĩ";
    case "PGS":
      return "Phó giáo sư";
    case "GS":
      return "Giáo sư";
    default:
      return rank;
  }
};

export const getStatusLabel = (status: string) => {
  switch (status?.toUpperCase()) {
    case "PENDING":
      return "Chờ duyệt";
    case "APPROVED":
      return "Đã duyệt";
    case "REJECTED":
      return "Đã từ chối";
    default:
      return status || "Không xác định";
  }
};

export const getStatusText = (status: string) => {
  switch (status?.toUpperCase()) {
    case "APPROVED":
      return "Đã duyệt";
    case "REJECTED":
      return "Từ chối";
    case "PENDING":
      return "Chờ duyệt";
    default:
      return status || "Không xác định";
  }
};

export function formatDateToVietnamTime(dateString: string): string {
  if (!dateString) return "Không có mô tả";

  const date = new Date(dateString);

  // Chuyển sang múi giờ Việt Nam (UTC+7)
  const options: Intl.DateTimeFormatOptions = {
    timeZone: "Asia/Ho_Chi_Minh", // Múi giờ Việt Nam
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };

  return new Intl.DateTimeFormat("vi-VN", options).format(date);
}

export const getVietnameseScale = (scale: string) => {
  switch (scale) {
    case "INSTITUTIONAL":
      return "Cấp đơn vị";
    case "UNIVERSITY":
      return "Cấp trường";
    case "DEPARTMENTAL":
      return "Cấp khoa / tỉnh";
    case "MINISTERIAL":
      return "Cấp bộ";
    case "NATIONAL":
      return "Cấp quốc gia";
    case "INTERNATIONAL":
      return "Cấp quốc tế";
    case "OTHERS":
      return "Khác";
    default:
      return scale;
  }
};
export const getVietnameseCourseType = (type?: string): string => {
  switch (type) {
    case "FORMAL":
      return "Chính quy";
    case "SPECIALIZED":
      return "Chuyên đề";
    case "EXTRACURRICULAR":
      return "Ngoại khóa";
    default:
      return "Không xác định";
  }
};

export const getProjectType = (type: string): string => {
  switch (type) {
    case "PROJECT":
      return "Dự án";
    case "RESEARCH":
      return "Nghiên cứu";
    case "TOPIC":
      return "Đề tài";
    default:
      return "Không xác định";
  }
};

// Lecturer
export const getAcademicRank = (rank: string) => {
  switch (rank) {
    case "CN":
      return "Cử nhân";
    case "THS":
      return "Thạc sĩ";
    case "TS":
      return "Tiến sĩ";
    case "PGS":
      return "Phó giáo sư";
    case "GS":
      return "Giáo sư";
    default:
      return rank;
  }
};
// Institution
// Partner
// Admin
// General
export const getStatusColor = (status: string) => {
  switch (status?.toUpperCase()) {
    case "PENDING":
      return "warning";
    case "APPROVED":
      return "info";
    case "REJECTED":
      return "error";
    default:
      return "default";
  }
};
export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("vi-VN");
};
