export const getAcademicRankLabel = (rank: string) => {
    const ranks: { [key: string]: string } = {
      CN: "Cử nhân",
      THS: "Thạc sĩ",
      TS: "Tiến sĩ",
      PGS: "Phó giáo sư",
      GS: "Giáo sư",
    };
    return ranks[rank] || rank;
  };

  export const majorAutoComplete = [
  "Công nghệ thông tin",
  "Kỹ thuật phần mềm",
  "Trí tuệ nhân tạo",
  "An toàn thông tin",
  "Mạng máy tính",
  "Hệ thống thông tin",
  "Khoa học dữ liệu",
  "Khoa học máy tính",
  "Kỹ thuật máy tính",
  "Kỹ thuật điện - điện tử",
];

export const jobFieldsAutoComplete = [
  "Công nghệ thông tin",
  "Giáo dục và Đào tạo",
  "Y tế và Chăm sóc sức khỏe",
  "Tài chính - Ngân hàng",
  "Kỹ thuật",
  "Luật pháp",
  "Marketing",
  "Xây dựng",
  "Khoa học xã hội",
  "Nghệ thuật",
];
export const certificationLevelsAutoComplete = [
  "Sơ cấp",
  "Trung cấp",
  "Nâng cao",
  "Chuyên gia",
  "Quốc tế",
  "Hành nghề",
  "Chứng chỉ khóa học",
  "Chứng chỉ nội bộ",
  "Chứng chỉ kỹ thuật",
  "Khác",
];