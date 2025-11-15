
import type { AttendedCourseCreateReq } from "../types/AttendedCourse";
import type { ResearchProjectCreateReq } from "../types/ResearchProject";
import type { TrainingProgramReq } from "../types/TrainingProgram";

type validateResult = {
  success: boolean;
  error: string;
  errorField?: string;
};
function isValidURL(url: string): boolean {
  const normalizedUrl =
    url.startsWith("http://") || url.startsWith("https://")
      ? url
      : `https://${url}`;

  try {
    const parsedUrl = new URL(normalizedUrl);
    const hostname = parsedUrl.hostname;

    // Regex mới: chấp nhận subdomain, gạch ngang, nhiều TLD (co.uk, info, v.v.)
    const domainPattern = /^(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
    return domainPattern.test(hostname);
  } catch (_) {
    return false;
  }
}

export const validateCourseForm = (formData: any) => {
  const errors: validateResult = {
    success: true,
    error: "",
  };

  if (
    !formData.title ||
    formData.title.trim() === "" ||
    formData.title.length < 3 ||
    formData.title.length > 50
  ) {
    errors.success = false;
    errors.error = "Tiêu đề khóa học không hợp lệ.";
    formData.title.length > 50;
    return errors;
  }
  if (
    !formData.topic ||
    formData.topic.trim() === "" ||
    formData.topic.length < 3 ||
    formData.topic.length > 50
  ) {
    errors.success = false;
    errors.error = "Chủ đề khóa học không hợp lệ.";
    return errors;
  }

  if (formData.description.length > 500) {
    errors.success = false;
    errors.error = "Mô tả khóa học không được vượt quá 100 ký tự.";
    return errors;
  }

  if (!formData.contentUrl || formData.contentUrl.trim() === "") {
    errors.success = false;
    errors.error = "URL nội dung là bắt buộc.";
  }

  if (!formData.language || formData.language.trim() === "") {
    errors.success = false;
    errors.error = "Ngôn ngữ là bắt buộc.";
  }
  if (!formData.startDate) {
    errors.success = false;
    errors.error = "Ngày bắt đầu là bắt buộc.";
    return errors;
  }
  if (
    formData.startDate &&
    formData.endDate &&
    new Date(formData.startDate) >= new Date(formData.endDate)
  ) {
    errors.success = false;
    errors.error = "Ngày bắt đầu phải trước ngày kết thúc.";
  }

  return errors;
};

export const validateAttendedCourseForm = (formData: AttendedCourseCreateReq) => {
  const errors: validateResult = {
    success: true,
    error: "",
  };

  // Validate title
  if (
    !formData.title ||
    formData.title.trim() === "" ||
    formData.title.length < 3 ||
    formData.title.length > 100
  ) {
    errors.success = false;
    errors.error = "Tiêu đề khóa học không hợp lệ (3-100 ký tự).";
    return errors;
  }

  // Validate topic
  if (
    !formData.topic ||
    formData.topic.trim() === "" ||
    formData.topic.length < 3 ||
    formData.topic.length > 50
  ) {
    errors.success = false;
    errors.error = "Chủ đề khóa học không hợp lệ (3-50 ký tự).";
    return errors;
  }

  // Validate organizer
  if (
    !formData.organizer ||
    formData.organizer.trim() === "" ||
    formData.organizer.length < 3 ||
    formData.organizer.length > 100
  ) {
    errors.success = false;
    errors.error = "Đơn vị tổ chức không hợp lệ (3-100 ký tự).";
    return errors;
  }

  // Validate courseType
  if (!formData.courseType || formData.courseType.trim() === "") {
    errors.success = false;
    errors.error = "Loại khóa học là bắt buộc.";
    return errors;
  }

  // Validate scale
  if (!formData.scale || formData.scale.trim() === "") {
    errors.success = false;
    errors.error = "Quy mô khóa học là bắt buộc.";
    return errors;
  }

  // Validate startDate
  if (!formData.startDate) {
    errors.success = false;
    errors.error = "Ngày bắt đầu là bắt buộc.";
    return errors;
  }

  // Validate endDate
  if (!formData.endDate) {
    errors.success = false;
    errors.error = "Ngày kết thúc là bắt buộc.";
    return errors;
  }

  // Validate date logic
  if (
    formData.startDate &&
    formData.endDate &&
    new Date(formData.startDate) >= new Date(formData.endDate)
  ) {
    errors.success = false;
    errors.error = "Ngày bắt đầu phải trước ngày kết thúc.";
    return errors;
  }

  // Validate numberOfHour
  if (
    !formData.numberOfHour ||
    isNaN(Number(formData.numberOfHour)) ||
    Number(formData.numberOfHour) <= 0 ||
    Number(formData.numberOfHour) > 1000
  ) {
    errors.success = false;
    errors.error = "Số giờ học không hợp lệ (1-1000 giờ).";
    return errors;
  }

  // Validate location
  if (
    !formData.location ||
    formData.location.trim() === "" ||
    formData.location.length < 3 ||
    formData.location.length > 200
  ) {
    errors.success = false;
    errors.error = "Địa điểm không hợp lệ (3-200 ký tự).";
    return errors;
  }

  // Validate description (optional but with limit)
  if (formData.description && formData.description.length > 500) {
    errors.success = false;
    errors.error = "Mô tả khóa học không được vượt quá 500 ký tự.";
    return errors;
  }

  // Validate courseUrl (optional but must be valid URL if provided)
  if (formData.courseUrl && formData.courseUrl.trim() !== "") {
    if (formData.courseUrl.length > 200) {
      errors.success = false;
      errors.error = "URL khóa học không được vượt quá 200 ký tự.";
      return errors;
    }

    if (!isValidURL(formData.courseUrl)) {
      errors.success = false;
      errors.error = "URL khóa học không hợp lệ.";
      return errors;
    }
  }

  return errors;
};

export const validateLecturerInfo = (formData: any) => {
  const errors: validateResult = {
    success: true,
    errorField: "",
    error: "",
  };

  if (formData.fullName === "" || formData.fullName.length > 300) {
    errors.success = false;
    errors.error =
      "Họ và tên không được để trống hoặc quá dài (tối đa 300 ký tự)";
    errors.errorField = "fullName";
    return errors;
  }
  if (formData.citizenId === "" || formData.citizenId.length != 12) {
    errors.success = false;
    errors.error = "Vui lòng nhập số CCCD/CMND hợp lệ (12 ký tự)";
    errors.errorField = "citizenId";
    return errors;
  }
  if (formData.gender === "") {
    errors.success = false;
    errors.error = "Vui lòng chọn giới tính";
    errors.errorField = "gender";
    return errors;
  }
  if (
    formData.phoneNumber === "" ||
    !/^0\d{9,10}$/.test(formData.phoneNumber)
  ) {
    errors.success = false;
    errors.error =
      "Vui lòng nhập số điện thoại hợp lệ (bắt đầu bằng 0 và có 10-11 số)";
    errors.errorField = "phoneNumber";
    return errors;
  }
  const now = new Date();
  const minDate = new Date("1900-01-01");
  const dob = new Date(formData.dateOfBirth);

  const age = now.getFullYear() - dob.getFullYear();
  const hasBirthdayPassed =
    now.getMonth() > dob.getMonth() ||
    (now.getMonth() === dob.getMonth() && now.getDate() >= dob.getDate());
  const actualAge = hasBirthdayPassed ? age : age - 1;

  if (
    !formData.dateOfBirth ||
    isNaN(dob.getTime()) ||
    dob >= now ||
    dob < minDate ||
    actualAge < 18
  ) {
    errors.success = false;
    errors.error = "Vui lòng chọn ngày sinh hợp lệ ( >= 18 tuổi).";
    errors.errorField = "dateOfBirth";
    return errors;
  }
  if (formData.academicRank === "") {
    errors.success = false;
    errors.error = "Vui lòng chọn học hàm";
    errors.errorField = "academicRank";
    return errors;
  }
  if (formData.specialization === "" || formData.specialization.length > 700) {
    errors.success = false;
    errors.error = "Vui lòng nhập chuyên ngành hợp lệ (tối đa 700 ký tự)";
    errors.errorField = "specialization";
    return errors;
  }
  if (
    formData.experienceYears === "" ||
    Number(formData.experienceYears) < 0 ||
    Number(formData.experienceYears) > 80 ||
    isNaN(Number(formData.experienceYears))
  ) {
    errors.success = false;
    errors.error = "Vui lòng nhập số năm kinh nghiệm hợp lệ";
    errors.errorField = "experienceYears";
    return errors;
  }
  if (
    formData.jobField === "" ||
    formData.jobField === null ||
    formData.jobField === undefined ||
    formData.jobField.length > 500
  ) {
    errors.success = false;
    errors.error = "Vui lòng nhập lĩnh vực công việc hợp lệ (tối đa 500 ký tự)";
    errors.errorField = "jobField";
    return errors;
  }
  if (formData.address === "" || formData.address.length > 500) {
    errors.success = false;
    errors.error = "Vui lòng nhập địa chỉ hợp lệ (tối đa 500 ký tự)";
    errors.errorField = "address";
    return errors;
  }
  if (formData.bio.length > 1000) {
    errors.success = false;
    errors.error = "Giới thiệu bản thân không được quá 1000 ký tự";
    errors.errorField = "bio";
    return errors;
  }
  return errors;
};

export const validateInstitutionInfo = (formData: any) => {
  const errors: validateResult = {
    success: true,
    errorField: "",
    error: "",
  };
  if (
    !formData.businessRegistrationNumber ||
    !/^\d{10}$/.test(formData.businessRegistrationNumber)
  ) {
    errors.success = false;
    errors.error = "Số đăng ký kinh doanh không hợp lệ (10 ký tự)";
    errors.errorField = "businessRegistrationNumber";
    return errors;
  }

  if (formData.institutionName === "" || formData.institutionName.length > 50) {
    errors.success = false;
    errors.error =
      "Tên cơ sở giáo dục không được để trống hoặc quá dài (tối đa 50 ký tự)";
    errors.errorField = "institutionName";
    return errors;
  }
  if (!formData.institutionType) {
    errors.success = false;
    errors.error = "Vui lòng chọn loại hình cơ sở giáo dục";
    errors.errorField = "institutionType";
    return errors;
  }
  if (
    formData.phoneNumber === "" ||
    !/^0\d{9,10}$/.test(formData.phoneNumber)
  ) {
    errors.success = false;
    errors.error = "Số điện thoại không hợp lệ (bắt đầu bằng 0 và có 10-11 số)";
    errors.errorField = "phoneNumber";
    return errors;
  }

  if (formData.address === "" || formData.address.length > 100) {
    errors.success = false;
    errors.error =
      "Địa chỉ không được để trống hoặc quá dài (tối đa 100 ký tự)";
    errors.errorField = "address";
    return errors;
  }

  if (!formData.website || formData.website.trim() === "") {
    errors.success = false;
    errors.error = "Website không được để trống";
    errors.errorField = "website";
    return errors;
  }

  if (formData.website.length > 100) {
    errors.success = false;
    errors.error = "Website không được dài quá 100 ký tự";
    errors.errorField = "website";
    return errors;
  }

  const validWebsite = isValidURL(formData.website);
  if (!validWebsite) {
    errors.success = false;
    errors.error = "Website không hợp lệ hoặc không phản hồi";
    errors.errorField = "website";
    return errors;
  }
  if (
    formData.representativeName === "" ||
    formData.representativeName.length > 30
  ) {
    errors.success = false;
    errors.error =
      "Tên đại diện không được để trống hoặc quá dài (tối đa 30 ký tự)";
    errors.errorField = "representativeName";
    return errors;
  }
  if (formData.position === "" || formData.position.length > 30) {
    errors.success = false;
    errors.error = "Chức vụ không được để trống hoặc quá dài (tối đa 30 ký tự)";
    errors.errorField = "position";
    return errors;
  }
  if (formData.description.length > 200) {
    errors.success = false;
    errors.error = "Mô tả không được quá 200 ký tự";
    errors.errorField = "description";
    return errors;
  }
  if (
    !formData.establishedYear ||
    isNaN(formData.establishedYear) ||
    formData.establishedYear < 1900 ||
    formData.establishedYear > new Date().getFullYear()
  ) {
    errors.success = false;
    errors.error = "Năm thành lập không hợp lệ";
    errors.errorField = "establishedYear";
    return errors;
  }

  return errors;
};

export const validatePartnerInfo = (formData: any) => {
  const errors: validateResult = {
    success: true,
    errorField: "",
    error: "",
  };

  if (
    !formData.businessRegistrationNumber ||
    !/^\d{10}$/.test(formData.businessRegistrationNumber)
  ) {
    errors.success = false;
    errors.error = "Mã số đăng ký kinh doanh không hợp lệ (10 ký tự)";
    errors.errorField = "businessRegistrationNumber";
    return errors;
  }

  if (
    formData.organizationName === "" ||
    formData.organizationName.length > 50
  ) {
    errors.success = false;
    errors.error =
      "Tên tổ chức không được để trống hoặc quá dài (tối đa 50 ký tự)";
    errors.errorField = "organizationName";
    return errors;
  }

  if (formData.industry === "" || formData.industry.length > 30) {
    errors.success = false;
    errors.error =
      "Ngành nghề không được để trống hoặc quá dài (tối đa 30 ký tự)";
    errors.errorField = "industry";
    return errors;
  }

  if (
    formData.phoneNumber === "" ||
    !/^0\d{9,10}$/.test(formData.phoneNumber)
  ) {
    errors.success = false;
    errors.error = "Số điện thoại không hợp lệ (bắt đầu bằng 0 và có 10-11 số)";
    errors.errorField = "phoneNumber";
    return errors;
  }

  if (!formData.website || formData.website.trim() === "") {
    errors.success = false;
    errors.error = "Website không được để trống";
    errors.errorField = "website";
    return errors;
  }

  if (formData.website.length > 100) {
    errors.success = false;
    errors.error = "Website không được dài quá 100 ký tự";
    errors.errorField = "website";
    return errors;
  }
  const validWebsite = isValidURL(formData.website);
  if (!validWebsite) {
    errors.success = false;
    errors.error = "Website không hợp lệ hoặc không phản hồi";
    errors.errorField = "website";
    return errors;
  }

  if (formData.address === "" || formData.address.length > 100) {
    errors.success = false;
    errors.error =
      "Địa chỉ không được để trống hoặc quá dài (tối đa 100 ký tự)";
    errors.errorField = "address";
    return errors;
  }

  if (
    formData.representativeName === "" ||
    formData.representativeName.length > 30
  ) {
    errors.success = false;
    errors.error =
      "Tên người đại diện không được để trống hoặc quá dài (tối đa 30 ký tự)";
    errors.errorField = "representativeName";
    return errors;
  }
  if (
    !formData.establishedYear || // Rỗng hoặc null
    !/^\d{4}$/.test(formData.establishedYear.toString()) || // Không đúng 4 chữ số
    formData.establishedYear < 1900 || // Nhỏ hơn 1900
    formData.establishedYear > new Date().getFullYear() // Lớn hơn năm hiện tại
  ) {
    errors.success = false;
    errors.error = "Năm thành lập không hợp lệ";
    errors.errorField = "establishedYear";
    return errors;
  }

  if (formData.position === "" || formData.position.length > 30) {
    errors.success = false;
    errors.error = "Chức vụ không được để trống hoặc quá dài (tối đa 30 ký tự)";
    errors.errorField = "position";
    return errors;
  }
  if (formData.description.length > 200) {
    errors.success = false;
    errors.error = "Mô tả không được quá 200 ký tự";
    errors.errorField = "description";
    return errors;
  }
  return errors;
};

export const validateDegreeInfo = (formData: any) => {
  const errors: validateResult = {
    success: true,
    errorField: "",
    error: "",
  };

  if (
    formData.referenceId.trim() === "" ||
    formData.referenceId.length > 15 ||
    formData.referenceId.length < 5
  ) {
    errors.success = false;
    errors.error =
      "Reference Id không được để trống, quá dài (tối đa 15 ký tự), quá ngắn (tối thiểu 5 ký tự) hoặc chứa ký tự đặc biệt";
    errors.errorField = "referenceId";
    return errors;
  }
  if (
    formData.name.trim() === "" ||
    formData.name.length > 30 ||
    formData.name.length < 3
  ) {
    errors.success = false;
    errors.error =
      "Tên bằng cấp không được để trống, quá dài (tối đa 30 ký tự) hoặc quá ngắn (tối thiểu 3 ký tự)";
    errors.errorField = "name";
    return errors;
  }
  if (
    formData.major.trim() === "" ||
    formData.major.length > 30 ||
    formData.major.length < 3
  ) {
    errors.success = false;
    errors.error =
      "Ngành học không được để trống, quá dài (tối đa 30 ký tự) hoặc quá ngắn (tối thiểu 3 ký tự)";
    errors.errorField = "major";
    return errors;
  }
  if (
    formData.level.trim() === "" ||
    formData.level.length > 20 ||
    formData.level.length < 3
  ) {
    errors.success = false;
    errors.error =
      "Trình độ không được để trống hoặc quá dài (tối đa 20 ký tự)";
    errors.errorField = "level";
    return errors;
  }
  if (
    formData.institution.trim() === "" ||
    formData.institution.length > 50 ||
    formData.institution.length < 3
  ) {
    errors.success = false;
    errors.error =
      "Tên cơ sở đào tạo không được để trống hoặc quá dài (tối đa 50 ký tự)";
    errors.errorField = "institution";
    return errors;
  }
  if (
    formData.startYear === "" ||
    isNaN(formData.startYear) ||
    formData.startYear < 1900 ||
    formData.startYear > new Date().getFullYear()
  ) {
    errors.success = false;
    errors.error = "Năm bắt đầu không hợp lệ";
    errors.errorField = "startYear";
    return errors;
  }
  if (
    formData.graduationYear === "" ||
    isNaN(formData.graduationYear) ||
    formData.graduationYear < formData.startYear ||
    formData.graduationYear > new Date().getFullYear()
  ) {
    errors.success = false;
    errors.error = "Năm tốt nghiệp không hợp lệ";
    errors.errorField = "graduationYear";
    return errors;
  }
  if (!formData.url) {
    errors.success = false;
    errors.error = "Vui lòng tải lên tài liệu bằng cấp";
    errors.errorField = "url";
    return errors;
  }

  if (formData.description && formData.description.length > 200) {
    errors.success = false;
    errors.error = "Mô tả không được quá 200 ký tự";
    errors.errorField = "description";
    return errors;
  }
  return errors;
};

export const validateCertificateInfo = (formData: any) => {
  const errors: validateResult = {
    success: true,
    errorField: "",
    error: "",
  };

  if (
    !formData.referenceId ||
    formData.referenceId.trim() === "" ||
    formData.referenceId.length < 5 ||
    formData.referenceId.length > 15
  ) {
    errors.success = false;
    errors.error =
      "Vui lòng nhập mã tham chiếu hợp lệ (5-15 ký tự, chỉ chứa chữ cái và số)";
    errors.errorField = "referenceId";
    return errors;
  }
  if (
    !formData.name ||
    formData.name.trim() === "" ||
    formData.name.length < 2 ||
    formData.name.length > 50
  ) {
    errors.success = false;
    errors.error = "Vui lòng nhập tên chứng chỉ hợp lệ (2-50 ký tự)";
    errors.errorField = "name";
    return errors;
  }
  if (
    !formData.issuedBy ||
    formData.issuedBy.trim() === "" ||
    formData.issuedBy.length < 2 ||
    formData.issuedBy.length > 50
  ) {
    errors.success = false;
    errors.error =
      "Vui lòng nhập tên tổ chức cấp chứng chỉ hợp lệ (2-50 ký tự)";
    errors.errorField = "issuedBy";
    return errors;
  }
  if (!formData.certificateUrl || formData.certificateUrl.trim() === "") {
    errors.success = false;
    errors.error = "Vui lòng tải lên tài liệu chứng chỉ";
    errors.errorField = "certificateUrl";
    return errors;
  }
  if (
    !formData.level ||
    formData.level.trim() === "" ||
    formData.level.length < 2 ||
    formData.level.length > 50
  ) {
    errors.success = false;
    errors.error = "Vui lòng nhập trình độ chứng chỉ hợp lệ (2-50 ký tự)";
    errors.errorField = "level";
    return errors;
  }
  if (!formData.issueDate) {
    errors.success = false;
    errors.error = "Vui lòng chọn ngày cấp";
    errors.errorField = "issueDate";
    return errors;
  }
  if (
    formData.expiryDate &&
    new Date(formData.issueDate) >= new Date(formData.expiryDate)
  ) {
    errors.success = false;
    errors.error = "Ngày hết hạn phải sau ngày cấp";
    errors.errorField = "expiryDate";
    return errors;
  }

  return errors;
};

export const validateResearchProjectForm = (
  formData: ResearchProjectCreateReq,
) => {
  const errors: validateResult = {
    success: true,
    error: "",
  };

  // Validate title
  if (
    !formData.title ||
    formData.title.trim() === "" ||
    formData.title.length < 3 ||
    formData.title.length > 100
  ) {
    errors.success = false;
    errors.error = "Tiêu đề dự án không hợp lệ (3-100 ký tự).";
    return errors;
  }

  // Validate researchArea
  if (
    !formData.researchArea ||
    formData.researchArea.trim() === "" ||
    formData.researchArea.length < 3 ||
    formData.researchArea.length > 100
  ) {
    errors.success = false;
    errors.error = "Lĩnh vực nghiên cứu không hợp lệ (3-100 ký tự).";
    return errors;
  }

  // Validate scale
  if (!formData.scale || formData.scale.trim() === "") {
    errors.success = false;
    errors.error = "Quy mô dự án là bắt buộc.";
    return errors;
  }

  // Validate startDate
  if (!formData.startDate) {
    errors.success = false;
    errors.error = "Ngày bắt đầu là bắt buộc.";
    return errors;
  }

  // Validate endDate
  if (!formData.endDate) {
    errors.success = false;
    errors.error = "Ngày kết thúc là bắt buộc.";
    return errors;
  }

  // Validate date logic
  if (
    formData.startDate &&
    formData.endDate &&
    new Date(formData.startDate) >= new Date(formData.endDate)
  ) {
    errors.success = false;
    errors.error = "Ngày bắt đầu phải trước ngày kết thúc.";
    return errors;
  }

  // Validate foundingAmount
  if (
    formData.foundingAmount !== undefined &&
    formData.foundingAmount !== null &&
    (isNaN(Number(formData.foundingAmount)) ||
      Number(formData.foundingAmount) < 0 ||
      Number(formData.foundingAmount) > 9999999999999
    )
  ) {
    errors.success = false;
    errors.error = "Số tiền tài trợ không hợp lệ. (0 - 9.999.999.999.999).";
    return errors;
  }

  // Validate foundingSource
  if (
    !formData.foundingSource ||
    formData.foundingSource.trim() === "" ||
    formData.foundingSource.length < 3 ||
    formData.foundingSource.length > 100
  ) {
    errors.success = false;
    errors.error = "Nguồn tài trợ không hợp lệ (3-100 ký tự).";
    return errors;
  }

  // Validate projectType
  if (!formData.projectType || formData.projectType.trim() === "") {
    errors.success = false;
    errors.error = "Loại dự án là bắt buộc.";
    return errors;
  }

  // Validate roleInProject
  if (
    !formData.roleInProject ||
    formData.roleInProject.trim() === "" ||
    formData.roleInProject.length < 3 ||
    formData.roleInProject.length > 50
  ) {
    errors.success = false;
    errors.error = "Vai trò trong dự án không hợp lệ (3-50 ký tự).";
    return errors;
  }

  // Validate publishedUrl (optional but must be valid URL if provided)
  if (formData.publishedUrl && formData.publishedUrl.trim() !== "") {
    if (formData.publishedUrl.length > 200) {
      errors.success = false;
      errors.error = "URL xuất bản không được vượt quá 200 ký tự.";
      return errors;
    }

    if (!isValidURL(formData.publishedUrl)) {
      errors.success = false;
      errors.error = "URL xuất bản không hợp lệ.";
      return errors;
    }
  }

  // Validate courseStatus
  if (!formData.courseStatus || formData.courseStatus.trim() === "") {
    errors.success = false;
    errors.error = "Trạng thái khóa học là bắt buộc.";
    return errors;
  }

  // Validate description (optional but with limit)
  if (formData.description && formData.description.length > 500) {
    errors.success = false;
    errors.error = "Mô tả dự án không được vượt quá 500 ký tự.";
    return errors;
  }

  return errors;
};

export const validateTrainingProgramForm = (formData: TrainingProgramReq) => {
  const errors: validateResult = {
    success: true,
    error: "",
  };
  if (
    !formData.title ||
    formData.title.trim() === "" ||
    formData.title.length < 2
  ) {
    errors.success = false;
    errors.error = "Tiêu đề chương trình không hợp lệ (> 2 kí tự).";
    return errors;
  }
  if (
    !formData.subTitle ||
    formData.subTitle.trim() === "" ||
    formData.subTitle.length < 2
  ) {
    errors.success = false;
    errors.error = "Tiêu đề phụ chương trình không hợp lệ (> 2 kí tự).";
    return errors;
  }
  if (
    !formData.shortDescription ||
    formData.shortDescription.trim() === "" ||
    formData.shortDescription.length < 2
  ) {
    errors.success = false;
    errors.error = "Mô tả ngắn chương trình không hợp lệ (> 2 kí tự).";
    return errors;
  }
  if (
    !formData.description ||
    formData.description.trim() === "" ||
    formData.description.length < 2
  ) {
    errors.success = false;
    errors.error = "Mô tả chương trình không hợp lệ (> 2 kí tự).";
    return errors;
  }
  if (formData.bannerUrl === "" || formData.bannerUrl.trim() === "") {
    errors.success = false;
    errors.error = "Banner là bắt buộc.";
    return errors;
  }
  if (formData.contentUrl === "" || formData.contentUrl.trim() === "") {
    errors.success = false;
    errors.error = "URL nội dung là bắt buộc.";
    return errors;
  }
  if (
    formData.syllabusFileUrl === "" ||
    formData.syllabusFileUrl.trim() === ""
  ) {
    errors.success = false;
    errors.error = "Đề cương là bắt buộc.";
    return errors;
  }
  if (
    formData.startDate &&
    formData.endDate &&
    new Date(formData.startDate) >= new Date(formData.endDate)
  ) {
    errors.success = false;
    errors.error = "Ngày bắt đầu phải trước ngày kết thúc.";
    return errors;
  }
  if (formData.durationHours <= 0 || formData.durationHours > 99999) {
    errors.success = false;
    errors.error = "Số giờ học phải lớn hơn 0 và nhỏ hơn 99999.";
    return errors;
  }
  if (formData.durationSessions <= 0 || formData.durationSessions > 99999) {
    errors.success = false;
    errors.error = "Số buổi học phải lớn hơn 0 và nhỏ hơn 99999.";
    return errors;
  }
  if (formData.scheduleDetail === "" || formData.scheduleDetail.trim() === "") {
    errors.success = false;
    errors.error = "Chi tiết lịch học là bắt buộc.";
    return errors;
  }
  if (formData.listedPrice < 0 || formData.listedPrice > 9999999999) {
    errors.success = false;
    errors.error = "Giá niêm yết không hợp lệ (0 - 9.999.999.999).";
    return errors;
  }
  if (formData.internalPrice < 0 || formData.internalPrice > 9999999999) {
    errors.success = false;
    errors.error = "Giá nội bộ không hợp lệ (0 - 9.999.999.999).";
    return errors;
  }
  if (formData.publicPrice < 0 || formData.publicPrice > 9999999999) {
    errors.success = false;
    errors.error = "Giá công khai không hợp lệ (0 - 9.999.999.999).";
    return errors;
  }
  if (
    formData.learningObjectives === "" ||
    formData.learningObjectives.trim() === "" ||
    formData.learningObjectives.length < 2
  ) {
    errors.success = false;
    errors.error = "Kiến thức được học không hợp lệ (> 2 kí tự).";
    return errors;
  }
  if (
    formData.requirements === "" ||
    formData.requirements.trim() === "" ||
    formData.requirements.length < 2
  ) {
    errors.success = false;
    errors.error = "Yêu cầu đầu vào không hợp lệ (> 2 kí tự).";
    return errors;
  }
  if (formData.learningOutcomes.length === 0) {
    errors.success = false;
    errors.error = "Vui lòng thêm ít nhất một kết quả đầu ra.";
    return errors;
  }
  if (formData.targetAudience === "" || formData.targetAudience.trim() === "") {
    errors.success = false;
    errors.error = "Đối tượng tham gia là bắt buộc.";
    return errors;
  }

  if (formData.minStudents <= 0 || formData.minStudents > 1000000) {
    errors.success = false;
    errors.error = "Số học viên tối thiểu phải lớn hơn 0 và nhỏ hơn 1.000.000.";
    return errors;
  }
  if (
    formData.maxStudents <= 0 ||
    formData.maxStudents > 1000000 ||
    formData.maxStudents <= formData.minStudents
  ) {
    errors.success = false;
    errors.error =
      "Số học viên tối đa phải lớn hơn 0 và nhỏ hơn 1.000.000 và lớn hơn số học viên tối thiểu.";
    return errors;
  }
  if (
    formData.openingCondition === "" ||
    formData.openingCondition.trim() === ""
  ) {
    errors.success = false;
    errors.error = "Điều kiện khai giảng là bắt buộc.";
    return errors;
  }
  if (formData.equipmentRequirement.length > 1000) {
    errors.success = false;
    errors.error = "Yêu cầu thiết bị không được vượt quá 1000 ký tự.";
    return errors;
  }
  if (formData.classroomLink && formData.classroomLink.trim() !== "") {
    if (formData.classroomLink.length > 200) {
      errors.success = false;
      errors.error = "Link phòng học không được vượt quá 200 ký tự.";
      return errors;
    }
  }
  if (formData.scale.length > 100) {
    errors.success = false;
    errors.error = "Quy mô chương trình không được vượt quá 100 ký tự.";
    return errors;
  }

  if (formData.tags.length === 0) {
    errors.success = false;
    errors.error = "Vui lòng thêm ít nhất một thẻ cho chương trình.";
    return errors;
  }
  if (
    formData.completionCertificateType === "" ||
    formData.completionCertificateType.trim() === ""
  ) {
    errors.success = false;
    errors.error = "Loại chứng nhận hoàn thành là bắt buộc.";
    return errors;
  }
  if (
    formData.certificateIssuer === "" ||
    formData.certificateIssuer.trim() === ""
  ) {
    errors.success = false;
    errors.error = "Đơn vị cấp chứng chỉ là bắt buộc.";
    return errors;
  }
  if (formData.rating) {
    if (
      isNaN(Number(formData.rating)) ||
      Number(formData.rating) < 0 ||
      Number(formData.rating) > 5
    ) {
      errors.success = false;
      errors.error = "Đánh giá phải là số từ 0 đến 5.";
      return errors;
    }
  }

  // Validate programLevel
  if (!formData.programLevel || formData.programLevel.trim() === "") {
    errors.success = false;
    errors.error = "Cấp độ chương trình là bắt buộc.";
    return errors;
  }

  return errors;
};
