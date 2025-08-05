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

export function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

export type Order = "asc" | "desc";

export function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}
