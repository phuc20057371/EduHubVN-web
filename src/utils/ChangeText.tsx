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

export  const getStatusLabel = (status: string) => {
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
