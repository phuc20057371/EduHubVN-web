import type { InstitutionRequest } from "../types/InstitutionRequest";
import type { PartnerRequest } from "../types/PartnerRequest";

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

  if (formData.description.length > 100) {
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

// const checkCitizenId = async (citizenId: string) => {
//   const response = await API.other.checkCitizenId(citizenId);
//   if (response.data.data) {
//     return true;
//   }
//   return false;
// };

export const validateLecturerInfo = (formData: any) => {
  const errors: validateResult = {
    success: true,
    errorField: "",
    error: "",
  };

  if (formData.fullName === "" || formData.fullName.length > 30) {
    errors.success = false;
    errors.error =
      "Họ và tên không được để trống hoặc quá dài (tối đa 30 ký tự)";
    errors.errorField = "fullName";
    return errors;
  }
  if (formData.citizenId === "" || formData.citizenId.length != 11) {
    errors.success = false;
    errors.error = "Vui lòng nhập số CCCD/CMND hợp lệ (11 ký tự)";
    errors.errorField = "citizenId";
    // if (await checkCitizenId(formData.citizenId)) {
    //   errors.success = false;
    //   errors.error = "Số CCCD/CMND đã tồn tại";
    //   errors.errorField = "citizenId";
    // }
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
  if (formData.specialization === "" || formData.specialization.length > 70) {
    errors.success = false;
    errors.error = "Vui lòng nhập chuyên ngành hợp lệ (tối đa 70 ký tự)";
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
    formData.jobField.length > 50
  ) {
    errors.success = false;
    errors.error = "Vui lòng nhập lĩnh vực công việc hợp lệ (tối đa 50 ký tự)";
    errors.errorField = "jobField";
    return errors;
  }
  if (formData.address === "" || formData.address.length > 100) {
    errors.success = false;
    errors.error = "Vui lòng nhập địa chỉ";
    errors.errorField = "address";
    return errors;
  }
  if (formData.bio.length > 200) {
    errors.success = false;
    errors.error = "Giới thiệu bản thân không được quá 200 ký tự";
    errors.errorField = "bio";
    return errors;
  }
  return errors;
};

export const validateInstitutionInfo = (formData: InstitutionRequest) => {
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
    formData.establishedYear &&
    (isNaN(formData.establishedYear) ||
      formData.establishedYear < 1900 ||
      formData.establishedYear > new Date().getFullYear())
  ) {
    errors.success = false;
    errors.error = "Năm thành lập không hợp lệ";
    errors.errorField = "establishedYear";
    return errors;
  }

  return errors;
};

export const validatePartnerInfo = (formData: PartnerRequest) => {
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
