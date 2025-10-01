
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

export const getScale = (scale: string) => {
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
export const getCourseType = (type?: string): string => {
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
    case "KS":
      return "Kỹ sư";
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
export const getInstitutionType = (type: string) => {
  switch (type) {
    case "UNIVERSITY":
      return "ĐH";
    case "TRAINING_CENTER":
      return "TTDT";
    default:
      return type;
  }
};
export const getInstitutionTypeText = (type: string) => {
  switch (type) {
    case "UNIVERSITY":
      return "Đại học";
    case "TRAINING_CENTER":
      return "Trung tâm đào tạo";
    default:
      return type;
  }
};
// Partner
export const getIndustryText = (industry: string) => {
  switch (industry) {
    case "MANUFACTURING":
      return "Sản xuất và Chế biến";
    case "TECHNOLOGY":
      return "Công nghệ thông tin";
    case "FINANCE":
      return "Tài chính - Ngân hàng";
    case "HEALTHCARE":
      return "Y tế - Chăm sóc sức khỏe";
    case "EDUCATION":
      return "Giáo dục - Đào tạo";
    case "RETAIL":
      return "Bán lẻ - Thương mại";
    case "CONSTRUCTION":
      return "Xây dựng - Kiến trúc";
    case "LOGISTICS":
      return "Logistics - Vận tải";
    case "ENERGY":
      return "Năng lượng";
    case "AGRICULTURE":
      return "Nông nghiệp";
    case "TOURISM":
      return "Du lịch - Khách sạn";
    case "MEDIA":
      return "Truyền thông - Quảng cáo";
    case "CONSULTING":
      return "Tư vấn";
    case "OTHER":
      return "Khác";
    default:
      return industry || "Không xác định";
  }
};
// Admin
// Course
// General
export const getStatusColor = (status: string) => {
  switch (status?.toUpperCase()) {
    case "PENDING":
      return "warning";
    case "APPROVED":
      return "success";
    case "REJECTED":
      return "error";
    default:
      return "default";
  }
};
export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("vi-VN");
};
export const getStatus = (status: string) => {
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

// Function to calculate relative time
export const getRelativeTime = (dateString: string): string => {
  const now = new Date();
  const updateTime = new Date(dateString);
  const diffInMs = now.getTime() - updateTime.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInMinutes < 5) {
    return "vừa mới cập nhật";
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} phút trước`;
  } else if (diffInHours < 24) {
    return `${diffInHours} giờ trước`;
  } else if (diffInDays < 7) {
    return `${diffInDays} ngày trước`;
  } else if (diffInWeeks < 4) {
    return `${diffInWeeks} tuần trước`;
  } else if (diffInMonths < 12) {
    return `${diffInMonths} tháng trước`;
  } else {
    return `${diffInYears} năm trước`;
  }
};

export const getCourseLevel = (level: string) => {
  switch (level) {
    case "BEGINNER":
      return "Cơ bản";
    case "INTERMEDIATE":
      return "Trung bình";
    case "ADVANCED":
      return "Nâng cao";
    default:
      return level;
  }
};
