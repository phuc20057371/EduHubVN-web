import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { TrainingProgramPublic } from "../../types/TrainingProgram";

// Helper function để format academic rank
const getAcademicRank = (rank: string | undefined): string => {
  const rankMap: { [key: string]: string } = {
    "PROFESSOR": "Giáo sư",
    "ASSOCIATE_PROFESSOR": "Phó Giáo sư",
    "DOCTOR": "Tiến sĩ", 
    "MASTER": "Thạc sĩ",
    "BACHELOR": "Cử nhân",
    "ENGINEER": "Kỹ sư",
    "OTHER": "Khác"
  };
  return rankMap[rank || ""] || rank || "";
};

// Custom hook để lấy chi tiết training program từ danh sách đã có
function useTrainingProgramDetail(
  programId: string,
  trainingPrograms: TrainingProgramPublic[],
) {
  const [program, setProgram] = useState<TrainingProgramPublic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const findProgramDetail = () => {
      try {
        setLoading(true);
        setError(null);

        // Kiểm tra programId hợp lệ
        if (!programId || !programId.trim()) {
          console.error("❌ Invalid program ID:", programId);
          setError("ID chương trình đào tạo không hợp lệ");
          return;
        }

        console.log(
          "🔍 Finding training program detail for ID:",
          programId,
          "in programs:",
          trainingPrograms.length,
        );

        // Tìm training program trong danh sách đã có (so sánh string)
        const foundProgram = trainingPrograms.find((p) => p.id === programId);

        if (foundProgram) {
          console.log("✅ Found training program:", foundProgram.title);
          setProgram(foundProgram);
        } else {
          console.warn(
            "⚠️ Không tìm thấy chương trình đào tạo trong danh sách, sử dụng mock data",
          );
        }
      } catch (err: any) {
        console.error("❌ Lỗi khi tìm chương trình đào tạo:", err);
        setError("Không thể tìm thấy chương trình đào tạo");
      } finally {
        setLoading(false);
      }
    };

    if (programId && trainingPrograms.length > 0) {
      findProgramDetail();
    }
  }, [programId, trainingPrograms]);

  return { program, loading, error };
}

interface TrainingProgramDetailPublicDialogProps {
  programId: string;
  isOpen: boolean;
  onClose: () => void;
}

const TrainingProgramDetailPublicDialog = ({
  programId,
  isOpen,
  onClose,
}: TrainingProgramDetailPublicDialogProps) => {
  const trainingPrograms = useSelector((state: any) => state.trainingProgramPublic);
  const { program, loading, error } = useTrainingProgramDetail(
    programId,
    trainingPrograms,
  );

  if (!isOpen) return null;

  // Handle click outside to close
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-xl bg-white shadow-xl">
          <div className="p-6">
            <div className="flex items-center justify-between border-b pb-4">
              <h2 className="text-xl font-semibold">Chi tiết chương trình đào tạo</h2>
              <button
                onClick={onClose}
                className="rounded-lg border border-gray-300 bg-white p-2 text-gray-500 hover:bg-gray-50"
              >
                ✕
              </button>
            </div>
            <div className="flex justify-center py-12">
              <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-600"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !program) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={handleBackdropClick}>
        <div className="w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-xl bg-white shadow-xl">
          <div className="p-6">
            <div className="flex items-center justify-between border-b pb-4">
              <h2 className="text-xl font-semibold">Chi tiết chương trình đào tạo</h2>
              <button
                onClick={onClose}
                className="rounded-lg border border-gray-300 bg-white p-2 text-gray-500 hover:bg-gray-50"
              >
                ✕
              </button>
            </div>
            <div className="py-12 text-center text-red-600">
              <p>{error || "Không tìm thấy chương trình đào tạo"}</p>
              <button
                onClick={onClose}
                className="mt-4 rounded-xl bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={handleBackdropClick}>
      <div className="w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="bg-gradient-to-br from-indigo-700 to-sky-500 text-white">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <button
                onClick={onClose}
                className="rounded-lg border border-white/30 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/20"
              >
                ← Đóng
              </button>
            </div>
            <div className="mt-6 grid items-center gap-8 md:grid-cols-2">
              <img
                src={program.bannerUrl || "https://via.placeholder.com/400x225"}
                alt={program.title}
                className="w-full rounded-2xl shadow-lg"
              />
              <div>
                <h1 className="text-3xl font-extrabold">
                  {program.title || "Chương trình đào tạo"}
                </h1>

                <div className="mt-4 flex flex-wrap gap-3 text-sm">
                  <span className="rounded-full border border-white/30 bg-white/15 px-3 py-1">
                    Thời lượng: {program.durationHours || 0} giờ
                  </span>
                  <span className="rounded-full border border-white/30 bg-white/15 px-3 py-1">
                    Buổi học: {program.durationSessions || 0} buổi
                  </span>
                  {program.rating && (
                    <span className="rounded-full border border-white/30 bg-white/15 px-3 py-1">
                      ⭐ {program.rating.toFixed(2)}
                    </span>
                  )}
                </div>
                <div className="mt-6 flex items-center gap-4">
                  <div className="text-2xl font-extrabold">
                    {program.publicPrice && program.priceVisible
                      ? program.publicPrice.toLocaleString("vi-VN") + " đ"
                      : "Liên hệ"}
                  </div>
                  <button className="h-11 rounded-xl bg-amber-500 px-5 font-semibold text-white hover:bg-amber-600 transition-colors">
                    Đăng ký chương trình
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2">
              <h2 className="text-xl font-bold">Danh sách bài học</h2>

              {/* Danh sách units từ training program */}
              {program.units && program.units.length > 0 ? (
                <ul className="mt-4 space-y-3 text-sm">
                  {program.units
                    .slice() // tạo bản sao để tránh mutate dữ liệu gốc
                    .sort((a: any, b: any) => a.orderSection - b.orderSection)
                    .map((unit: any, index: number) => (
                      <li
                        key={unit.id || index}
                        className="rounded-xl border bg-white p-3 shadow"
                      >
                        <div className="font-semibold">
                          {unit.orderSection}.{" "}
                          {unit.title || unit.name || `Bài học ${index + 1}`}
                        </div>
                        {unit.description && (
                          <div className="mt-1 text-gray-600">
                            {unit.description}
                          </div>
                        )}
                        <div className="mt-2 flex flex-wrap gap-2 text-xs">
                          {unit.durationHours && (
                            <span className="rounded bg-blue-50 px-2 py-1 text-blue-700">
                              ⏱️ {unit.durationHours} giờ
                            </span>
                          )}
                          {unit.lecturer && (
                            <span className="rounded bg-green-50 px-2 py-1 text-green-700">
                              👨‍🏫 {unit.lecturer.fullName}
                            </span>
                          )}
                          {unit.isLead && (
                            <span className="rounded bg-amber-50 px-2 py-1 text-amber-700">
                              ⭐ Bài học chính
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                </ul>
              ) : (
                /* Fallback content nếu không có units */
                <ul className="mt-4 space-y-3 text-sm">
                  <li className="rounded-xl border bg-white p-3 shadow">
                    <div className="font-semibold">
                      Bài 1: Giới thiệu tổng quan
                    </div>
                    <div className="mt-1 text-gray-600">
                      Tìm hiểu về nền tảng và kiến thức cơ bản
                    </div>
                  </li>
                  <li className="rounded-xl border bg-white p-3 shadow">
                    <div className="font-semibold">
                      Bài 2: Thực hành và ứng dụng
                    </div>
                    <div className="mt-1 text-gray-600">
                      Áp dụng kiến thức vào các bài tập thực tế
                    </div>
                  </li>
                  <li className="rounded-xl border bg-white p-3 shadow">
                    <div className="font-semibold">Bài 3: Dự án cuối khóa</div>
                    <div className="mt-1 text-gray-600">
                      Hoàn thành dự án tổng hợp để đánh giá năng lực
                    </div>
                  </li>
                </ul>
              )}

              {/* Chuẩn đầu ra */}
              {program.learningOutcomes && (
                <div className="mt-6">
                  <h3 className="mb-2 text-lg font-semibold">Chuẩn đầu ra</h3>
                  <div className="whitespace-pre-line leading-relaxed text-gray-700">
                    {program.learningOutcomes}
                  </div>
                </div>
              )}
            </div>

            <aside>
              {/* Thông tin chương trình */}
              <div className="rounded-xl border bg-gray-50 p-4">
                <h3 className="mb-4 text-xl font-bold">Thông tin chương trình</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  {program.programMode && (
                    <li>
                      <strong>Hình thức:</strong> {program.programMode}
                    </li>
                  )}

                  {program.startDate && (
                    <li>
                      <strong>Ngày bắt đầu:</strong>{" "}
                      {new Date(program.startDate).toLocaleDateString("vi-VN")}
                    </li>
                  )}

                  {program.endDate && (
                    <li>
                      <strong>Ngày kết thúc:</strong>{" "}
                      {new Date(program.endDate).toLocaleDateString("vi-VN")}
                    </li>
                  )}

                  {program.durationHours && (
                    <li>
                      <strong>Thời lượng:</strong> {program.durationHours} giờ
                    </li>
                  )}
                  {program.durationSessions && (
                    <li>
                      <strong>Số buổi học:</strong> {program.durationSessions}{" "}
                      buổi
                    </li>
                  )}
                </ul>
              </div>

              {/* Đối tượng tham gia */}
              {program.targetAudience && (
                <div className="mt-6">
                  <h3 className="text-xl font-bold">Đối tượng tham gia</h3>
                  <div className="mt-4 whitespace-pre-line text-sm leading-relaxed text-gray-700">
                    {program.targetAudience}
                  </div>
                </div>
              )}

              {/* Yêu cầu */}
              {program.requirements && (
                <div className="mt-6">
                  <h3 className="text-xl font-bold">Yêu cầu</h3>
                  <div className="mt-4 whitespace-pre-line text-sm leading-relaxed text-gray-700">
                    {program.requirements}
                  </div>
                </div>
              )}

              {/* Giảng viên */}
              {program.units && program.units.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-xl font-bold">Giảng viên</h3>
                  <div className="mt-4 space-y-3">
                    {(() => {
                      // Lọc và phân loại giảng viên từ các unit
                      const lecturerMap = new Map();

                      program.units.forEach((unit: any) => {
                        if (unit.lecturer && unit.lecturer.id) {
                          const lecturerId = unit.lecturer.id;
                          const existingLecturer = lecturerMap.get(lecturerId);

                          if (!existingLecturer) {
                            // Thêm giảng viên mới
                            lecturerMap.set(lecturerId, {
                              ...unit.lecturer,
                              isLead: unit.isLead || false,
                              units: [unit.title || unit.name],
                            });
                          } else {
                            // Cập nhật thông tin nếu là lead hoặc thêm unit
                            existingLecturer.isLead =
                              existingLecturer.isLead || unit.isLead || false;
                            if (unit.title || unit.name) {
                              existingLecturer.units.push(
                                unit.title || unit.name,
                              );
                            }
                          }
                        }
                      });

                      // Chuyển thành array và sắp xếp (lead lecturer lên đầu)
                      const uniqueLecturers = Array.from(
                        lecturerMap.values(),
                      ).sort((a, b) => {
                        if (a.isLead && !b.isLead) return -1;
                        if (!a.isLead && b.isLead) return 1;
                        return 0;
                      });

                      return uniqueLecturers.map(
                        (lecturer: any, index: number) => (
                          <div
                            key={lecturer.id || index}
                            className="flex items-start gap-3 rounded-xl border-l-4 border-l-blue-500 bg-white p-3 shadow"
                          >
                            <img
                              src={
                                lecturer.avatarUrl ||
                                "https://via.placeholder.com/48x48"
                              }
                              alt={lecturer.fullName}
                              className="h-12 w-12 flex-shrink-0 rounded-lg object-cover"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <div className="truncate text-sm font-semibold">
                                  {lecturer.fullName || "Giảng viên"}
                                </div>
                                {lecturer.isLead && (
                                  <span className="rounded bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                                    Chính
                                  </span>
                                )}
                              </div>
                              <div className="mt-1 text-xs text-gray-500">
                                {getAcademicRank(lecturer.academicRank)}
                                {lecturer.specialization &&
                                  ` • ${lecturer.specialization}`}
                              </div>

                              {lecturer.experienceYears && (
                                <div className="mt-1 text-xs text-gray-500">
                                  {lecturer.experienceYears} năm kinh nghiệm
                                </div>
                              )}
                            </div>
                          </div>
                        ),
                      );
                    })()}
                  </div>
                </div>
              )}

              {/* Tags */}
              {program.tags && program.tags.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-xl font-bold">Tags</h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {program.tags.map((tag: string, index: number) => (
                      <span
                        key={index}
                        className="rounded border border-blue-300 bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingProgramDetailPublicDialog;
