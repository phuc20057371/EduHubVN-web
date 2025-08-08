import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API } from "../../utils/Fetch";
import { Box, Paper, CircularProgress, Alert } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setLecturerProfile } from "../../redux/slice/LecturerProfileSlice";
import { getVietnameseCourseType, getVietnameseScale } from "../../utils/ChangeText";

const LecturerInfoPage = () => {
  const dispatch = useDispatch();

  const { id } = useParams<{ id: string }>();
  const lecturerProfile = useSelector((state: any) => state.lecturerProfile);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const domain = window.location.hostname;
  // const BASE_URL = `http://${domain}:8080`;

  useEffect(() => {
    const fetchLecturerData = async () => {
      if (!id) {
        setError("ID không hợp lệ");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        console.log("Lecturer ID từ URL:", id);

        const response = await API.other.getLecturerProfile(id);
        console.log("Kết quả API:", response.data.data);

        dispatch(setLecturerProfile(response.data.data));
        setError(null);
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
        setError("Không thể tải thông tin giảng viên");
      } finally {
        setLoading(false);
      }
    };

    fetchLecturerData();
  }, [id]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  const formatMonthYear = (dateString?: string): string | null => {
    if (!dateString) return null;

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;

    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${year}`;
  };
  const formatDate = (dateString?: string): string => {
    if (!dateString) return "";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  const academicRankMap: Record<string, string> = {
    CN: "Cử nhân",
    THS: "Thạc sĩ",
    TS: "Tiến sĩ",
    PGS: "Phó Giáo sư",
    GS: "Giáo sư",
  };

  // {JSON.stringify(lecturerData, null, 2)}
  return (
    <Box p={3}>
      <div className="flex justify-center">
        <div className="w-full max-w-[794px]">
          <Paper elevation={3} className="mt-4 p-6">
            <h2 className="mb-6 text-center text-xl font-bold text-blue-700">
              THÔNG TIN GIẢNG VIÊN
            </h2>

            <section className="mb-6">
              <h3 className="mb-1 text-lg font-semibold text-blue-600">
                LÝ LỊCH CÁ NHÂN
              </h3>
              <div className="mb-4 h-0.5 bg-blue-600"></div>

              <div className="space-y-3 text-sm">
                <div className="flex">
                  <span className="w-40 font-semibold">Họ tên:</span>
                  <span>{lecturerProfile.lecturer?.fullName}</span>
                </div>
                <div className="flex">
                  <span className="w-40 font-semibold">Ngày sinh:</span>
                  <span>
                    {formatDate(lecturerProfile.lecturer?.dateOfBirth)}
                  </span>
                </div>
                <div className="flex">
                  <span className="w-40 font-semibold">Giới tính:</span>
                  <span>{lecturerProfile.lecturer?.gender ? "Nam" : "Nữ"}</span>
                </div>
                <div className="flex">
                  <span className="w-40 font-semibold">Email:</span>
                  <span>{lecturerProfile.lecturer?.email}</span>
                </div>
                <div className="flex">
                  <span className="w-40 font-semibold">Số điện thoại:</span>
                  <span>{lecturerProfile.lecturer?.phoneNumber}</span>
                </div>
                <div className="flex">
                  <span className="w-40 font-semibold">Địa chỉ:</span>
                  <span>{lecturerProfile.lecturer?.address}</span>
                </div>
                <div className="flex">
                  <span className="w-40 font-semibold">Chuyên ngành:</span>
                  <span>{lecturerProfile.lecturer?.specialization}</span>
                </div>
                <div className="flex">
                  <span className="w-40 font-semibold">Học hàm:</span>
                  <span>
                    {academicRankMap[lecturerProfile.lecturer?.academicRank] ||
                      "Không có thông tin"}
                  </span>
                </div>
                <div className="flex">
                  <span className="w-40 font-semibold">Lĩnh vực:</span>
                  <span>{lecturerProfile.lecturer?.jobField}</span>
                </div>
                <div className="flex">
                  <span className="w-40 font-semibold">Giới thiệu:</span>
                  <span className="flex-1 whitespace-pre-line">
                    {lecturerProfile.lecturer?.bio}
                  </span>
                </div>
              </div>
            </section>
            {/* BẰNG CẤP */}
            <section className="mb-6">
              <h3 className="mb-1 text-lg font-semibold text-blue-600">
                BẰNG CẤP
              </h3>
              <div className="mb-4 h-0.5 bg-blue-600"></div>

              {lecturerProfile.degrees &&
                [...lecturerProfile.degrees]
                  .filter((degree) => degree.status === "APPROVED")
                  .sort((a, b) => a.graduationYear - b.graduationYear)
                  .map((degree: any) => (
                    <div key={degree.id} className="mb-4 text-sm">
                      <div className="flex gap-2">
                        <span className="min-w-[60px] font-medium">
                          {degree.graduationYear}
                        </span>
                        <div>
                          <span className="font-semibold">{degree.name}:</span>{" "}
                          {degree.level} ngành {degree.major} tại{" "}
                          {degree.institution}
                        </div>
                      </div>
                      {degree.url && (
                        <div className="ml-[68px]">
                          <a
                            href={degree.url}
                            className="text-blue-600 underline"
                            target="_blank"
                            rel="noreferrer"
                          >
                            Bấm vào đây để xem
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
            </section>
            <section className="mb-6">
              <h3 className="mb-1 text-lg font-semibold text-blue-600">
                CHỨNG CHỈ
              </h3>
              <div className="mb-4 h-0.5 bg-blue-600"></div>

              {lecturerProfile.certifications &&
                [...lecturerProfile.certifications]
                  .filter((cert) => cert.status === "APPROVED")
                  .sort(
                    (a, b) =>
                      new Date(a.issueDate).getTime() -
                      new Date(b.issueDate).getTime(),
                  )
                  .map((cert: any) => (
                    <div key={cert.id} className="mb-4 text-sm">
                      <div className="flex gap-2">
                        <span className="min-w-[60px] font-medium">
                          {new Date(cert.issueDate).getFullYear()}
                        </span>
                        <div>
                          <span className="font-semibold">{cert.name}:</span>{" "}
                          {cert.level && `${cert.level} – `}Cấp bởi{" "}
                          {cert.issuedBy}
                        </div>
                      </div>
                      {cert.certificateUrl && (
                        <div className="ml-[68px]">
                          <a
                            href={cert.certificateUrl}
                            className="text-blue-600 underline"
                            target="_blank"
                            rel="noreferrer"
                          >
                            Bấm vào đây để xem
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
            </section>

            {/* NGHIÊN CỨU KHOA HỌC / DỰ ÁN / ĐỀ TÀI */}
            <section className="mb-6">
              <h3 className="mb-1 text-lg font-semibold text-blue-600">
                NGHIÊN CỨU KHOA HỌC / DỰ ÁN / ĐỀ TÀI
              </h3>
              <div className="mb-4 h-0.5 bg-blue-600"></div>

              {lecturerProfile.researchProjects &&
                [...lecturerProfile.researchProjects]
                  .sort(
                    (a, b) =>
                      new Date(b.startDate).getTime() -
                      new Date(a.startDate).getTime(),
                  )
                  .filter((proj) => proj.status === "APPROVED")
                  .map((proj: any) => {
                    const start = formatMonthYear(proj.startDate);
                    const end = formatMonthYear(proj.endDate);
                    const timeRange =
                      start || end
                        ? `(${start || ""}${start && end ? " – " : ""}${end || "- Hiện tại"})`
                        : "";

                    return (
                      <div
                        key={proj.id}
                        className="mb-6 grid grid-cols-[150px_1fr] gap-2 text-sm"
                      >
                        <div className="font-medium text-gray-800">
                          {timeRange}
                        </div>
                        <div className="font-semibold text-gray-800">
                          {proj.title}
                        </div>

                        <div></div>
                        <div>
                          <p>
                            <span className="font-semibold italic">
                              Lĩnh vực:
                            </span>{" "}
                            {proj.researchArea}
                          </p>
                          <p>
                            <span className="font-semibold italic">
                              Quy mô:
                            </span>{" "}
                            {getVietnameseScale(proj.scale)}
                          </p>
                          <p>
                            <span className="font-semibold italic">
                              Vai trò:
                            </span>{" "}
                            {proj.roleInProject}
                          </p>
                          <p>
                            <span className="font-semibold italic">
                              Mô tả công việc:
                            </span>{" "}
                            {proj.description}
                          </p>
                          {proj.publishedUrl && (
                            <p>
                              <span className="font-semibold italic">
                                Kết quả / Công bố:{" "}
                              </span>
                              <a
                                href={proj.publishedUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 underline"
                              >
                                Bấm vào đây để xem
                              </a>
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
            </section>

            {/* KHÓA ĐÀO TẠO ĐÃ THEO HỌC */}
            <section className="mb-6">
              <h3 className="mb-1 text-lg font-semibold text-blue-600">
                KHÓA ĐÀO TẠO ĐÃ THEO HỌC
              </h3>
              <div className="mb-4 h-0.5 bg-blue-600"></div>

              {lecturerProfile.attendedTrainingCourses &&
                [...lecturerProfile.attendedTrainingCourses]
                  .sort(
                    (a, b) =>
                      new Date(a.startDate).getTime() -
                      new Date(b.startDate).getTime(),
                  )
                  .filter((course) => course.status === "APPROVED")
                  .map((course: any) => {
                    const start = formatMonthYear(course.startDate);
                    const end = formatMonthYear(course.endDate);
                    const timeRange =
                      start || end
                        ? `(${start || ""}${start && end ? " – " : ""}${end || "- Hiện tại"})`
                        : "";

                    return (
                      <div
                        key={course.id}
                        className="mb-4 grid grid-cols-[150px_1fr] gap-2 text-sm"
                      >
                        <div className="font-medium">{timeRange}</div>
                        <div>
                          <p className="text-gray-800">
                            {course.title} tại {course.organizer}
                          </p>
                          {course.courseUrl && (
                            <a
                              href={course.courseUrl}
                              className="text-sm text-blue-600 underline"
                              target="_blank"
                              rel="noreferrer"
                            >
                              Bấm vào đây để xem
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
            </section>

            {/* KHÓA ĐÀO TẠO GIẢNG DẠY BỞI GIẢNG VIÊN */}
            <section className="mb-6">
              <h3 className="mb-1 text-lg font-semibold text-blue-600">
                KHÓA ĐÀO TẠO GIẢNG DẠY BỞI GIẢNG VIÊN
              </h3>
              <div className="mb-4 h-0.5 bg-blue-600"></div>

              {lecturerProfile.ownedTrainingCourses &&
                [...lecturerProfile.ownedTrainingCourses]
                  .sort(
                    (a, b) =>
                      new Date(a.startDate).getTime() -
                      new Date(b.startDate).getTime(),
                  )
                  .filter((course) => course.status === "APPROVED")
                  .map((course: any) => {
                    const start = formatMonthYear(course.startDate);
                    const end = formatMonthYear(course.endDate);
                    const timeRange = `${start} – ${end}`;

                    return (
                      <div
                        key={course.id}
                        className="mb-4 grid grid-cols-[150px_1fr] gap-2 text-sm"
                      >
                        <div className="font-medium">{timeRange}</div>
                        <div>
                          <p className="font-semibold text-gray-800">
                            {course.title} – {course.topic}
                          </p>
                          <p>
                            <strong>Loại hình:</strong>{" "}
                            {getVietnameseCourseType(course.courseType)}
                          </p>
                          <p>
                            <strong>Quy mô:</strong>{" "}
                            {getVietnameseScale(course.scale)}
                          </p>
                          {course.courseUrl && (
                            <p>
                              <a
                                href={course.courseUrl}
                                className="text-blue-600 underline"
                                target="_blank"
                                rel="noreferrer"
                              >
                                Bấm vào đây để xem
                              </a>
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
            </section>
          </Paper>
        </div>
      </div>
    </Box>
  );
};

export default LecturerInfoPage;
