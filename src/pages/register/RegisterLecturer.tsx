import { Box, Button, MenuItem, Stack, TextField } from "@mui/material";

import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import { Fragment, useEffect, useState } from "react";
import UploadDegreeModal from "../../components/UploadDegreeModal";
import type { DegreeRequest } from "../../types/DegreeRequest";
import UploadCertificationModal from "../../components/UploadCertificationModal";
import type { CertificationRequest } from "../../types/CertificationRequest";
import { API } from "../../utils/Fetch";
import { useNavigate } from "react-router-dom";

const RegisterLecturer = () => {
  const steps = ['Thông tin cá nhân', 'Thông tin chứng chỉ và bằng cấp', 'Gửi yêu cầu tạo tài khoản '];
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set<number>());

  const savedData = JSON.parse(localStorage.getItem("registerLecturerForm") || "{}");

  const [citizenId, setCitizenId] = useState(savedData.citizenId || "");
  const [phoneNumber, setPhoneNumber] = useState(savedData.phoneNumber || "");
  const [fullName, setFullName] = useState(savedData.fullName || "");
  const [dateOfBirth, setDateOfBirth] = useState(savedData.dateOfBirth || "");
  const [gender, setGender] = useState(savedData.gender || "");
  const [bio, setBio] = useState(savedData.bio || "");
  const [address, setAddress] = useState(savedData.address || "");
  const [academicRank, setAcademicRank] = useState(savedData.academicRank || "");
  const [specialization, setSpecialization] = useState(savedData.specialization || "");
  const [experienceYears, setExperienceYears] = useState(savedData.experienceYears || "");

  const [openModal, setOpenModal] = useState(false);
  const handleOpen = () => setOpenModal(true);
  const [degrees, setDegrees] = useState<DegreeRequest[]>([]);
  const [certifications, setCertifications] = useState<CertificationRequest[]>([]);
  const [openCertificationModal, setOpenCertificationModal] = useState(false);

  const handleDeleteDegree = (indexToDelete: number) => {
    setDegrees(prev => prev.filter((_, index) => index !== indexToDelete));
  };

  const handleDeleteCertification = (indexToDelete: number) => {
    setCertifications(prev => prev.filter((_, index) => index !== indexToDelete));
  };



  const isStepOptional = (step: number) => {
    return step === 1;
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = async () => {
    if (activeStep === 2) {
      if(gender === "") {
        alert("Vui lòng chọn giới tính");
      }
      const lecturerData = {
        citizenId,
        phoneNumber,
        fullName,
        dateOfBirth,
        gender: gender === "male" ? true : false,
        bio,
        address,
        academicRank,
        specialization,
        experienceYears,
      };

      try {
        // 2. Gọi API: Đăng ký giảng viên
        const resLecturer = await API.user.registerLeccturer(lecturerData);
        const lecturerId = resLecturer.data.data.id; // Lấy ID giảng viên từ phản hồi
        const degreePayload = degrees.map((deg) => ({ ...deg, lecturerId }));
        await API.user.createDegree(degreePayload);
        const certificationPayload = certifications.map((cert) => ({ ...cert, lecturerId }));
        await API.user.createCertification(certificationPayload);

        // 5. Thành công → điều hướng
        navigate("/");

      } catch (error) {
        console.error("❌ Lỗi gửi dữ liệu:", error);
        alert("Có lỗi xảy ra. Vui lòng kiểm tra lại.");
      }
    }
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };
  useEffect(() => {
    const formData = {
      citizenId,
      phoneNumber,
      fullName,
      dateOfBirth,
      gender,
      bio,
      address,
      academicRank,
      specialization,
      experienceYears,
    };
    localStorage.setItem("registerLecturerForm", JSON.stringify(formData));
  }, [citizenId, phoneNumber, fullName, dateOfBirth, gender, bio, address, academicRank, specialization, experienceYears]);




  return (
    <Box sx={{ width: '80%' }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps: { completed?: boolean } = {};
          const labelProps: {
            optional?: React.ReactNode;
          } = {};
          if (isStepOptional(index)) {
            labelProps.optional = (
              <Typography variant="caption">Optional</Typography>
            );
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            All steps completed - you&apos;re finished
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </Fragment>
      ) : (
        <Fragment>
          {/* <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography> */}
          {activeStep === 0 && (
            <Box
              maxWidth={600}
              mx="auto"
              mt={5}
              p={3}
              bgcolor="white"
              borderRadius={2}
              boxShadow={3}
            >
              <h2 style={{ textAlign: "center", marginBottom: 24 }}>Đăng ký Giảng viên</h2>
              <form>
                <Stack spacing={2} mb={3}>
                  <TextField
                    fullWidth
                    label="Họ và tên"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                  />
                </Stack>

                <Stack spacing={2}>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>

                    <TextField
                      fullWidth
                      label="Số CCCD"
                      value={citizenId}
                      onChange={e => setCitizenId(e.target.value)}
                    />
                    <TextField
                      fullWidth
                      label="Số điện thoại"
                      value={phoneNumber}
                      onChange={e => setPhoneNumber(e.target.value)}
                    />
                  </Stack>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>

                    <TextField
                      fullWidth
                      label="Ngày sinh"
                      type="date"
                      value={dateOfBirth}
                      onChange={e => setDateOfBirth(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Stack>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <TextField
                      select
                      fullWidth
                      label="Giới tính"
                      value={gender}
                      onChange={e => setGender(e.target.value)}
                    >
                      <MenuItem value="">Chọn giới tính</MenuItem>
                      <MenuItem value="male">Nam</MenuItem>
                      <MenuItem value="female">Nữ</MenuItem>
                      <MenuItem value="other">Khác</MenuItem>
                    </TextField>

                    <TextField
                      fullWidth
                      label="Số năm kinh nghiệm"
                      type="number"
                      value={experienceYears}
                      onChange={e => setExperienceYears(e.target.value)}
                    />
                  </Stack>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    {/* <TextField
                      fullWidth
                      label="Ảnh đại diện (URL)"
                      value={avatarUrl}
                      onChange={e => setAvatarUrl(e.target.value)}
                    /> */}
                    <TextField
                      fullWidth
                      label="Học hàm"
                      value={academicRank}
                      onChange={e => setAcademicRank(e.target.value)}
                    />
                    <TextField
                      fullWidth
                      label="Chuyên ngành"
                      value={specialization}
                      onChange={e => setSpecialization(e.target.value)}
                    />
                  </Stack>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <TextField
                      fullWidth
                      label="Địa chỉ"
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                    />
                  </Stack>
                  <TextField
                    fullWidth
                    label="Giới thiệu bản thân"
                    multiline
                    minRows={3}
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                  />
                  {/* <Button fullWidth variant="contained" type="submit">
                    Đăng ký
                  </Button> */}
                </Stack>
              </form>
            </Box>
          )}
          {activeStep === 1 && (
            <div className="flex w-full gap-20 mt-5 justify-evenly">
              {/* BẰNG CẤP */}
              <div className="flex flex-col items-center w-11/12 mb-10 ml-10">
                <h2 className="mb-2 text-base font-semibold">🎓 Bằng cấp</h2>

                <div className="pr-2 space-y-3 overflow-y-auto max-h-96"> {/* Đây là vùng cuộn */}
                  {degrees.map((degree, index) => (
                    <div key={index} className="relative p-4 bg-white border rounded-md shadow-sm">
                      <button
                        onClick={() => handleDeleteDegree(index)}
                        className="absolute text-red-500 top-2 right-2 hover:text-red-700"
                      >
                        🗑
                      </button>
                      <p className="text-sm font-semibold">{degree.name}</p>
                      <p className="text-sm text-gray-700">Ngành: {degree.major}</p>
                      <p className="text-sm text-gray-700">Trường: {degree.institution}</p>
                      <p className="text-sm text-gray-700">
                        Thời gian: {degree.startYear} - {degree.graduationYear}
                      </p>
                      <p className="text-sm text-gray-700">Trình độ: {degree.level}</p>

                      {degree.url && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-700">File:</p>
                          <a
                            href={degree.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-32 h-20 mt-1 overflow-hidden border rounded"
                          >
                            <img
                              src={degree.url}
                              alt="Degree file"
                              className="object-cover w-full h-full"
                            />
                          </a>
                        </div>
                      )}

                      {degree.description && (
                        <p className="mt-2 text-sm text-gray-600">Mô tả: {degree.description}</p>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleOpen}
                  className="px-4 py-2 mt-3 text-white bg-blue-600 rounded hover:bg-blue-700"
                >
                  ➕ Thêm bằng cấp
                </button>
              </div>


              {/* CHỨNG CHỈ */}
              <div className="flex flex-col items-center w-11/12 mb-10 ml-10">
                <h2 className="mb-2 text-base font-semibold">📜 Chứng chỉ</h2>
                <div className="space-y-3">
                  {certifications.map((cert, index) => (
                    <div key={index} className="relative p-4 bg-white border rounded-md shadow-sm">
                      {/* Nút xoá */}
                      <button
                        onClick={() => handleDeleteCertification(index)}
                        className="absolute text-red-500 top-2 right-2 hover:text-red-700"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                          <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>

                      </button>

                      <p className="text-sm font-semibold">{cert.name}</p>
                      <p className="text-sm text-gray-700">Cấp bởi: {cert.issuedBy}</p>
                      <p className="text-sm text-gray-700">
                        Ngày cấp: {new Date(cert.issueDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-700">
                        Hết hạn: {new Date(cert.expiryDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-700">Trình độ: {cert.level}</p>

                      {cert.certificateUrl && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-700">File:</p>
                          <a
                            href={cert.certificateUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-32 h-20 mt-1 overflow-hidden border rounded"
                          >
                            <img
                              src={cert.certificateUrl}
                              alt="Certificate file"
                              className="object-cover w-full h-full"
                            />
                          </a>
                        </div>
                      )}

                      {cert.description && (
                        <p className="mt-2 text-sm text-gray-600">Mô tả: {cert.description}</p>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setOpenCertificationModal(true)}
                  className="px-4 py-2 mt-3 text-white bg-blue-600 rounded hover:bg-blue-700"
                >
                  ➕ Thêm chứng chỉ
                </button>
              </div>

            </div>
          )

          }
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Trở lại
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            {isStepOptional(activeStep) && (
              <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                Bỏ qua
              </Button>
            )}
            <Button onClick={handleNext}>
              {activeStep === steps.length - 1 ? 'Hoàn tất' : 'Tiếp tục'}
            </Button>
          </Box>

        </Fragment>
      )}
      <UploadDegreeModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={(degree) => {
          console.log("Degree nhận được:", degree);
          setDegrees(prev => [...prev, degree]);
        }}
      />
      <UploadCertificationModal
        open={openCertificationModal}
        onClose={() => setOpenCertificationModal(false)}
        onSubmit={(cert) => {
          console.log("Certification nhận được:", cert);
          setCertifications(prev => [...prev, cert]);
        }}
      />
    </Box>

  )
}

export default RegisterLecturer