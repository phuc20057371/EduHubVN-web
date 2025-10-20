import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import GuestImage1 from "../../assets/guest1.png";
import GuestImage2 from "../../assets/guest2.png";
import LecturerCarousel from "../../components/LecturerCarousel";
import { setTrainingPrograms2 } from "../../redux/slice/TrainingProgramSlice2";
import { getAcademicRank } from "../../utils/ChangeText";
import { API } from "../../utils/Fetch";

// Custom hook để lấy dữ liệu top 7 giảng viên từ API
function useTopLecturers() {
  const [lecturers, setLecturers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLecturers = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await API.public.getTop6Lecturers();
        console.log("✅ Top 6 Lecturers API Response:", response);

        // Xử lý response theo cấu trúc thực tế
        let lecturersData = [];

        if (response.data) {
          if (Array.isArray(response.data)) {
            lecturersData = response.data;
          } else if (response.data.data && Array.isArray(response.data.data)) {
            lecturersData = response.data.data;
          } else if (
            response.data.lecturers &&
            Array.isArray(response.data.lecturers)
          ) {
            lecturersData = response.data.lecturers;
          } else {
            console.warn("⚠️ Cấu trúc response không mong đợi:", response.data);
            lecturersData = [];
          }
        }

        console.log("👨‍🏫 Lecturers data:", lecturersData);

        if (lecturersData.length > 0) {
          setLecturers(lecturersData);
        } else {
          console.warn("⚠️ Không có giảng viên từ API, sử dụng mock data");
        }
      } catch (err: any) {
        console.error("❌ Lỗi khi lấy dữ liệu giảng viên:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLecturers();
  }, []);

  return { lecturers, loading, error };
}

// ----------- UI Parts -----------
function Hero({ onOpenRegister }: { onOpenRegister: () => void }) {
  const navigate = useNavigate();
  return (
    <section className="relative overflow-hidden font-sans text-white">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#00b2ff] via-[#00b2ff] to-white/50"></div>
      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h1 className="text-3xl font-extrabold leading-tight md:text-5xl">
            EDUHUB
          </h1>
          <h2 className="pt-3 leading-tight md:text-5xl">KẾT NỐI TRI THỨC</h2>
          <h2 className="pb-1 pt-3 leading-tight md:text-5xl">
            KIẾN TẠO TƯƠNG LAI
          </h2>
          <p className="mt-4 text-white/90 md:text-lg">
            Nền tảng kết nối giảng viên, trường học, doanh nghiệp để hợp tác và
            phát triển nghề nghiệp giáo dục.
          </p>
          <div className="mt-6 flex gap-3">
            <button
              className="rounded-xl bg-amber-400 px-5 py-3 font-semibold text-indigo-900 shadow transition hover:translate-y-[-1px]"
              onClick={() => {
                try {
                  navigate("/register");
                } catch (error) {
                  onOpenRegister();
                }
              }}
            >
              Tìm hiểu thêm
            </button>
            {/* <a
              href="#khoahoc"
              className="rounded-xl border border-white/30 bg-white/10 px-5 py-3 font-semibold"
            >
              Xem khóa học
            </a> */}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative"
        >
          <img
            src={GuestImage1}
            alt="EduHubVN Hero Illustration"
            className="h-auto w-full rounded-2xl"
          />
        </motion.div>
      </div>
    </section>
  );
}

function WhyChooseSection() {
  return (
    <section id="truonghoc" className="py-16 font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Left side - Illustration */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <img
              src={GuestImage2}
              alt="Why Choose EduHubVN Illustration"
              className="h-auto w-full rounded-2xl"
            />
          </motion.div>

          {/* Right side - Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="text-center lg:text-left">
              <h2 className="mb-4 text-3xl font-extrabold text-gray-900">
                Tại sao chọn
              </h2>
              <div className="mb-8 flex items-center justify-center gap-2 lg:justify-start">
                <div className="bounded-full flex h-10 w-10 items-center justify-center">
                  <span className="text-lg font-bold text-white">⚡</span>
                </div>
                <span className="text-3xl font-extrabold text-gray-900">
                  EduHubVN?
                </span>
              </div>
            </div>

            {/* Option boxes */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="cursor-pointer rounded-xl border-2 border-blue-200 bg-blue-50 p-6 transition-all hover:border-blue-300"
                >
                  <h3 className="mb-3 font-semibold">Đề tài đa dạng</h3>
                  <p className="text-sm leading-relaxed">
                    Kết nối với hàng nghìn giảng viên có kinh nghiệm và chuyên
                    môn cao
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="cursor-pointer rounded-xl border-2 border-blue-200 bg-blue-50 p-6 transition-all hover:border-blue-300"
                >
                  <h3 className="mb-3 font-semibold">Trường & Trung tâm</h3>
                  <p className="text-sm leading-relaxed">
                    Kết nối với hàng nghìn giảng viên có kinh nghiệm và chuyên
                    môn cao
                  </p>
                </motion.div>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="cursor-pointer rounded-xl border-2 border-blue-200 bg-blue-50 p-6 transition-all hover:border-blue-300"
              >
                <h3 className="mb-3 font-semibold">Giảng viên chuyên nghiệp</h3>
                <p className="text-sm leading-relaxed">
                  Kết nối với hàng nghìn giảng viên có kinh nghiệm và chuyên môn
                  cao
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function StatPills() {
  const stats = [
    {
      label: "Giảng viên",
      value: "1000+",
      icon: (
        <svg
          className="h-8 w-8 text-amber-500"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      ),
    },
    {
      label: "Trường & Trung tâm",
      value: "500+",
      icon: (
        <svg
          className="h-8 w-8 text-amber-500"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z" />
        </svg>
      ),
    },
    {
      label: "Đối tác",
      value: "200+",
      icon: (
        <svg
          className="h-8 w-8 text-amber-500"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" />
        </svg>
      ),
    },
    {
      label: "Dự án hoàn thành",
      value: "2000+",
      icon: (
        <svg
          className="h-8 w-8 text-amber-500"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
        </svg>
      ),
    },
  ];
  return (
    <section className="relative overflow-hidden py-6 font-sans">
      {/* Background split - white top, orange bottom */}
      <div className="absolute inset-0">
        <div className="h-1/2 bg-white"></div>
        <div className="h-1/2 bg-orange-400"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center gap-4 overflow-x-auto">
          {stats.map((s, idx) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="flex min-w-[200px] flex-shrink-0 items-center gap-4 rounded-2xl border border-gray-200 bg-white px-6 py-4 shadow-sm"
            >
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-amber-100">
                {s.icon}
              </div>
              <div className="flex flex-col">
                <div className="text-2xl font-extrabold text-amber-600">
                  {s.value}
                </div>
                <div className="text-sm font-medium text-gray-600">
                  {s.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: 1,
      title: "Đăng ký tài khoản",
      desc: "Tạo hồ sơ chi tiết với thông tin chuyên môn",
      icon: (
        <svg
          className="h-6 w-6 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      ),
    },
    {
      n: 2,
      title: "Tìm kiếm cơ hội",
      desc: "Duyệt qua các đề tài và dự án phù hợp",
      icon: (
        <svg
          className="h-6 w-6 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
        </svg>
      ),
    },
    {
      n: 3,
      title: "Kết nối & Hợp tác",
      desc: "Liên hệ và bắt đầu các dự án hợp tác",
      icon: (
        <svg
          className="h-6 w-6 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.54.37-2.01.99L14 10.5h2.5L15 15h-3v7h2v-5h2v5h2zM12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zM5.5 6c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2zm2 16v-7H9V9.5c0-.83-.67-1.5-1.5-1.5S6 8.67 6 9.5V15H4v7h3.5z" />
        </svg>
      ),
    },
  ];
  return (
    <section
      id="quytrinh"
      className="bg-gradient-to-b from-[#fb9739] via-[#2596be]/20 to-white py-16 font-sans"
      style={{ backgroundColor: "#fb9739" }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-extrabold text-black">
            Cách thức hoạt động
          </h2>
          <p className="text-lg text-black">
            Quy trình đơn giản để bắt đầu hành trình kết nối và hợp tác
          </p>
        </div>

        {/* Three Step Cards */}
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((s, idx) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg"
            >
              {/* Large Number Background - Full Height */}
              <div className="absolute bottom-0 right-0 top-0 flex items-center justify-center pr-4">
                <span className="opacity-19 text-[18rem] font-extrabold leading-none text-amber-200">
                  {s.n}
                </span>
              </div>

              {/* Icon */}
              <div className="relative z-10 mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-400">
                {s.icon}
              </div>

              {/* Content */}
              <h3 className="relative z-10 mb-3 text-xl font-bold text-black">
                {s.title}
              </h3>
              <p className="relative z-10 leading-relaxed text-gray-700">
                {s.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function InstructorsSlider() {
  const { lecturers, loading } = useTopLecturers();

  // Transform API data to match the new component format
  const transformedLecturers = lecturers.map((lecturer) => ({
    ...lecturer,
    field:
      lecturer.field ||
      ["ART", "SOFT SKILL", "CEH", "DATA", "BUSINESS"][
        Math.floor(Math.random() * 5)
      ],
    specialization: lecturer.specialization || "Lĩnh Vực/ Chuyên Ngành",
  }));

  return (
    <section id="giangvien">
      <LecturerCarousel lecturers={transformedLecturers} loading={loading} />
    </section>
  );
}

function CourseSearch({
  openCourse,
  trainingPrograms,
  loading,
  error,
}: {
  openCourse: (id: string) => void;
  trainingPrograms: any[];
  loading: boolean;
  error: string | null;
}) {
  const [q, setQ] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Lấy tất cả tags unique từ training programs
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    trainingPrograms.forEach((program) => {
      if (program.tags && Array.isArray(program.tags)) {
        program.tags.forEach((tag: string) => tags.add(tag));
      }
    });
    return Array.from(tags).sort();
  }, [trainingPrograms]);

  const filtered = useMemo(() => {
    // Lọc chương trình đào tạo đã được publish
    let filteredPrograms = trainingPrograms.filter(
      (p) => p.programStatus === "PUBLISHED",
    );

    // Lọc theo selected tags
    if (selectedTags.length > 0) {
      filteredPrograms = filteredPrograms.filter((p) => {
        if (!p.tags || !Array.isArray(p.tags)) return false;
        return selectedTags.some((tag) => p.tags.includes(tag));
      });
    }

    // Nếu không có query tìm kiếm, hiển thị ngẫu nhiên 3 chương trình (hoặc tất cả nếu có filter tags)
    if (!q || q.trim() === "") {
      if (selectedTags.length > 0) {
        // Nếu có filter tags, hiển thị tất cả kết quả
        return filteredPrograms;
      } else {
        // Nếu không có filter, hiển thị ngẫu nhiên 3 chương trình
        const shuffled = [...filteredPrograms].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, 3);
      }
    }

    // Nếu có query tìm kiếm, hiển thị tất cả chương trình phù hợp
    return filteredPrograms.filter((p) => {
      const searchTerm = q.toLowerCase().trim();

      // Tìm trong tất cả các trường text của chương trình đào tạo
      const searchableFields = [
        p.title || "",
        p.subTitle || "",
        p.shortDescription || "",
        p.description || "",
        p.targetAudience || "",
        p.requirements || "",
        p.programMode || "",
        p.programType || "",
      ];

      // Thêm giá vào search (convert to string)
      if (p.publicPrice) {
        searchableFields.push(p.publicPrice.toString());
        searchableFields.push(p.publicPrice.toLocaleString("vi-VN"));
      }

      // Thêm tags vào search
      if (p.tags && Array.isArray(p.tags)) {
        searchableFields.push(...p.tags);
      }

      // Tìm kiếm fuzzy: kiểm tra từng từ trong query
      const searchWords = searchTerm
        .split(" ")
        .filter((word) => word.length > 0);

      // Kiểm tra xem có trường nào chứa search term không
      return searchableFields.some((field) => {
        const fieldLower = field.toLowerCase();
        // Nếu tìm thấy toàn bộ query
        if (fieldLower.includes(searchTerm)) return true;
        // Hoặc tìm thấy tất cả các từ trong query
        return searchWords.every((word) => fieldLower.includes(word));
      });
    });
  }, [trainingPrograms, q, selectedTags]);

  // Loading state
  if (loading) {
    return (
      <section
        id="khoahoc"
        className="bg-gradient-to-b from-white via-[#2596be]/10 to-[#2596be]/80 py-16 font-sans"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-extrabold text-gray-900 md:text-3xl">
            Chương trình đào tạo nổi bật
          </h2>
          <div className="mt-8 flex justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section
        id="khoahoc"
        className="bg-gradient-to-b from-white via-[#2596be]/10 to-[#2596be]/80 py-16 font-sans"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-extrabold text-gray-900 md:text-3xl">
            Chương trình đào tạo nổi bật
          </h2>
          <div className="mt-8 text-center text-red-600">
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-xl bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
            >
              Thử lại
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="khoahoc"
      className="bg-gradient-to-b from-white via-[#2596be]/10 to-[#2596be]/80 py-16 font-sans"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-extrabold text-gray-900 md:text-3xl">
          {(q && q.trim()) || selectedTags.length > 0
            ? `Tìm thấy ${filtered.length} chương trình đào tạo`
            : "Chương trình đào tạo nổi bật"}
        </h2>

        <div className="mt-8">
          {/* Search Input */}
          <div className="relative">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Tìm kiếm chương trình đào tạo, chủ đề..."
              className="h-12 w-full rounded-full border-2 border-gray-200 pl-4 pr-12 text-base text-gray-700 focus:border-blue-500 focus:outline-none"
            />
            <button className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 transform items-center justify-center rounded-full bg-blue-600">
              <svg
                className="h-5 w-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>

          {/* Tags Filter */}
          {allTags.length > 0 && (
            <div className="mt-4">
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      if (selectedTags.includes(tag)) {
                        setSelectedTags(selectedTags.filter((t) => t !== tag));
                      } else {
                        setSelectedTags([...selectedTags, tag]);
                      }
                    }}
                    className={`rounded border px-3 py-1 text-sm font-medium transition-colors ${
                      selectedTags.includes(tag)
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
                {/* {selectedTags.length > 0 && (
                  <button
                    onClick={() => setSelectedTags([])}
                    className="rounded border border-red-300 bg-white px-3 py-1 text-sm font-medium text-red-600 hover:border-red-400 hover:bg-red-50"
                  >
                    ✕ Xóa tất cả
                  </button>
                )} */}
              </div>
            </div>
          )}
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {filtered.length === 0 ? (
            <div className="col-span-3 py-8 text-center text-gray-500">
              Không tìm thấy chương trình đào tạo nào phù hợp
            </div>
          ) : (
            filtered.map((program) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                key={program.id}
                className="overflow-hidden rounded-2xl bg-white shadow"
              >
                <img
                  src={
                    program.bannerUrl || "https://via.placeholder.com/400x225"
                  }
                  alt={program.title}
                  className="aspect-video w-full object-cover"
                />
                <div className="p-4">
                  <div className="line-clamp-2 text-lg font-semibold leading-tight">
                    {program.title}
                  </div>
                  <div className="mt-2 line-clamp-2 text-sm text-gray-600">
                    {program.shortDescription ||
                      "Mô tả chương trình đào tạo..."}
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    {program.rating && (
                      <div className="flex items-center text-amber-500">
                        <span className="text-sm">★</span>
                        <span className="ml-1 text-sm font-medium">
                          {program.rating.toFixed(2)}
                        </span>
                      </div>
                    )}
                    <div className="text-sm text-gray-500">
                      {program.durationHours
                        ? `${program.durationHours} giờ`
                        : ""}
                      {program.durationSessions
                        ? ` • ${program.durationSessions} buổi`
                        : ""}
                    </div>
                  </div>
                  <div className="mt-2 font-bold text-indigo-700">
                    {program.publicPrice && program.priceVisible
                      ? program.publicPrice.toLocaleString("vi-VN") + " đ"
                      : "Liên hệ"}
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <button className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-white">
                      Đăng ký chương trình
                    </button>
                    <button
                      onClick={() => {
                        if (program.id && program.id.trim()) {
                          openCourse(program.id);
                        } else {
                          console.error("Invalid program ID:", program.id);
                        }
                      }}
                      className="rounded-xl border px-4 py-2 text-sm"
                    >
                      Xem thêm
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const items = [
    {
      id: 1,
      name: "TS. Nguyễn Văn A",
      role: "Giảng viên ĐH Bách Khoa",
      text: "EduHubVN giúp tôi dễ dàng kết nối với các đơn vị đào tạo & doanh nghiệp.",
    },
    {
      id: 2,
      name: "Trung tâm ABC",
      role: "Đơn vị đào tạo",
      text: "Kết nối được nhiều giảng viên chất lượng, vận hành minh bạch.",
    },
    {
      id: 3,
      name: "Công ty XYZ",
      role: "Đối tác doanh nghiệp",
      text: "Đội ngũ giảng viên chuyên gia hỗ trợ đào tạo nội bộ hiệu quả.",
    },
  ];
  return (
    <section
      id="doanhnghiep"
      className="bg-gradient-to-b from-[#2596be]/80 to-[#2596be] py-16 font-sans"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-extrabold text-gray-900 md:text-3xl">
          Khách hàng nói gì về chúng tôi
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {items.map((i) => (
            <motion.div
              key={i.id}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl bg-white p-6 shadow"
            >
              <div className="text-amber-500">★★★★★</div>
              <p className="mt-3 text-gray-700">“{i.text}”</p>
              <div className="mt-4 font-semibold">{i.name}</div>
              <div className="text-sm text-gray-500">{i.role}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Custom hook để lấy chi tiết training program từ danh sách đã có
function useTrainingProgramDetail(programId: string, trainingPrograms: any[]) {
  const [program, setProgram] = useState<any>(null);
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
          console.warn("⚠️ Không tìm thấy chương trình đào tạo trong danh sách, sử dụng mock data",);
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

// ------------ New Pages ------------
function CourseDetail({ id, back }: { id: string; back: () => void }) {
  const trainingPrograms = useSelector((state: any) => state.trainingProgram2);
  const { program, loading, error } = useTrainingProgramDetail(
    id,
    trainingPrograms,
  );

  if (loading) {
    return (
      <main className="font-sans">
        <section className="bg-gradient-to-br from-indigo-700 to-sky-500 text-white">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <button
              onClick={back}
              className="rounded-lg border border-white/30 bg-white/10 px-3 py-1.5 text-sm"
            >
              ← Quay lại
            </button>
            <div className="mt-6 flex justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-white"></div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (error || !program) {
    return (
      <main className="font-sans">
        <section className="bg-gradient-to-br from-indigo-700 to-sky-500 text-white">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <button
              onClick={back}
              className="rounded-lg border border-white/30 bg-white/10 px-3 py-1.5 text-sm"
            >
              ← Quay lại
            </button>
            <div className="mt-6 text-center text-red-600">
              <p>{error || "Không tìm thấy chương trình đào tạo"}</p>
              <button
                onClick={back}
                className="mt-4 rounded-xl bg-white/20 px-4 py-2 text-white hover:bg-white/30"
              >
                Quay lại
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="font-sans">
      <section className="bg-gradient-to-br from-indigo-700 to-sky-500 text-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <button
            onClick={back}
            className="rounded-lg border border-white/30 bg-white/10 px-3 py-1.5 text-sm"
          >
            ← Quay lại
          </button>
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
              <p className="mt-3 text-white/90">
                {program.shortDescription ||
                  program.description ||
                  "Mô tả chương trình đào tạo"}
              </p>
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
                <button className="h-11 rounded-xl bg-amber-500 px-5 font-semibold text-white">
                  Đăng ký chương trình
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
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

            {/* Mô tả chi tiết - di chuyển xuống dưới */}
            {program.description && (
              <div className="mt-8">
                <h3 className="mb-2 text-lg font-semibold">
                  Mô tả chương trình
                </h3>
                <div className="whitespace-pre-line leading-relaxed text-gray-700">
                  {program.description}
                </div>
              </div>
            )}

            {/* Nội dung đào tạo */}
            {program.content && (
              <div className="mt-6">
                <h3 className="mb-2 text-lg font-semibold">Nội dung đào tạo</h3>
                <div className="whitespace-pre-line leading-relaxed text-gray-700">
                  {program.content}
                </div>
              </div>
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
                                {lecturer.fullName}{" "}
                              </div>
                              {lecturer.isLead && (
                                <span className="flex-shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                                  Giảng viên chính
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
                                {lecturer.experienceYears} năm KN{" "}
                                {lecturer.jobField &&
                                  `trong lĩnh vực ${lecturer.jobField}`}
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
      </section>
    </main>
  );
}

function InstructorList({ back }: { back: () => void }) {
  const [q, setQ] = useState("");
  const { lecturers, loading } = useTopLecturers();
  const list = useMemo(
    () =>
      lecturers.filter((i) =>
        i.fullName.toLowerCase().includes(q.toLowerCase()),
      ),
    [q, lecturers],
  );
  return (
    <main className="font-sans">
      <section className="bg-gradient-to-r from-indigo-700 to-sky-500 text-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-extrabold">Danh sách giảng viên</h1>
            <button
              onClick={back}
              className="rounded-lg border border-white/30 bg-white/10 px-3 py-1.5 text-sm"
            >
              ← Về trang chủ
            </button>
          </div>
          <div className="mt-6 max-w-xl">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Tìm giảng viên..."
              className="h-11 w-full rounded-xl border bg-white px-4 text-gray-800"
            />
          </div>
        </div>
      </section>
      <section className="py-10">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:grid-cols-2 sm:px-6 md:grid-cols-3 lg:grid-cols-4 lg:px-8">
            {list.map((i) => (
              <motion.div
                key={i.id}
                whileHover={{ y: -4 }}
                className="overflow-hidden rounded-2xl bg-white shadow"
              >
                <img
                  src={i.avatarUrl || "https://via.placeholder.com/200x200"}
                  alt={i.fullName}
                  className="aspect-square w-full object-cover"
                />
                <div className="p-4">
                  <div className="font-semibold">{i.fullName}</div>
                  <div className="text-sm text-gray-600">
                    {getAcademicRank(i.academicRank)} • {i.specialization}
                  </div>
                  {i.experienceYears && (
                    <div className="mt-1 text-xs text-gray-500">
                      {i.experienceYears} năm kinh nghiệm
                    </div>
                  )}
                  <button className="mt-3 h-10 rounded-xl border px-4 text-sm">
                    Xem hồ sơ
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

// ------------ Root App ------------
export default function EduHubMockV2() {
  const [view, setView] = useState<"home" | "programDetail" | "instructors">(
    "home",
  );
  const [programId, setProgramId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redux
  const dispatch = useDispatch();
  const trainingPrograms = useSelector((state: any) => state.trainingProgram2);

  // Fetch training programs data and dispatch to Redux
  useEffect(() => {
    const fetchTrainingPrograms = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("🔄 Fetching training programs from API...");
        const response = await API.public.getAllPrograms();
        console.log("✅ Training Programs API Response:", response);

        // Xử lý response theo cấu trúc thực tế
        let programsData = [];

        if (response.data) {
          if (Array.isArray(response.data)) {
            programsData = response.data;
          } else if (response.data.data && Array.isArray(response.data.data)) {
            programsData = response.data.data;
          } else if (
            response.data.programs &&
            Array.isArray(response.data.programs)
          ) {
            programsData = response.data.programs;
          } else {
            console.warn("⚠️ Cấu trúc response không mong đợi:", response.data);
            programsData = [];
          }
        }

        console.log("📊 Training Programs data:", programsData);

        // Dispatch data vào Redux store
        dispatch(setTrainingPrograms2(programsData));
      } catch (err: any) {
        console.error("❌ Lỗi khi lấy dữ liệu training programs:", err);
        setError(err.message || "Không thể tải dữ liệu chương trình đào tạo");
      } finally {
        setLoading(false);
      }
    };

    // Chỉ fetch nếu chưa có dữ liệu trong Redux store
    if (!trainingPrograms || trainingPrograms.length === 0) {
      fetchTrainingPrograms();
    }
  }, [dispatch, trainingPrograms]);

  // Log training programs data for debugging
  useEffect(() => {
    if (trainingPrograms && trainingPrograms.length > 0) {
      console.log("📚 Training Programs loaded:", trainingPrograms);
    }
    if (error) {
      console.error("❌ Training Programs error:", error);
    }
  }, [trainingPrograms, error]);

  const openProgram = (id: string) => {
    // Validation ID trước khi mở
    if (!id || !id.trim()) {
      console.error("❌ Invalid program ID:", id);
      alert("ID chương trình đào tạo không hợp lệ!");
      return;
    }

    console.log("📖 Opening program detail for ID:", id);
    setProgramId(id);
    setView("programDetail");
  };

  return (
    <div className="guest-page-font min-h-screen bg-white text-gray-900">
      {view === "home" && (
        <>
          <Hero onOpenRegister={() => {}} />
          <WhyChooseSection />
          <StatPills />
          <HowItWorks />
          <InstructorsSlider />
          <CourseSearch
            openCourse={openProgram}
            trainingPrograms={trainingPrograms}
            loading={loading}
            error={error}
          />
          <Testimonials />
          {/* <NewsSection /> */}
        </>
      )}
      {view === "programDetail" && programId && (
        <>
          <CourseDetail id={programId} back={() => setView("home")} />
        </>
      )}
      {view === "instructors" && (
        <>
          <InstructorList back={() => setView("home")} />
        </>
      )}
    </div>
  );
}
