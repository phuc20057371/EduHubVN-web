import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import GuestImage1 from "../../assets/guest1.png";
import { getAcademicRank, getCourseLevel } from "../../utils/ChangeText";
import { API } from "../../utils/Fetch";
import GuestImage2 from "../../assets/guest2.png";
import LecturerCarousel from "../../components/LecturerCarousel";

// Mock data fallback — use API data when available
const mockInstructors = [
  {
    id: "1",
    fullName: "TS. Nguyễn Văn A",
    specialization: "Lĩnh Vực/ Chuyên Ngành",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&h=240&fit=crop&crop=face",
    academicRank: "TS",
    experienceYears: 15,
    field: "ART",
  },
  {
    id: "2",
    fullName: "ThS. Nguyễn Văn B",
    specialization: "Lĩnh Vực/ Chuyên Ngành",
    avatarUrl:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=240&h=240&fit=crop&crop=face",
    academicRank: "ThS",
    experienceYears: 12,
    field: "SOFT SKILL",
  },
  {
    id: "3",
    fullName: "KS. Nguyễn Văn C",
    specialization: "Lĩnh Vực/ Chuyên Ngành",
    avatarUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=240&h=240&fit=crop&crop=face",
    academicRank: "KS",
    experienceYears: 10,
    field: "CEH",
  },
  {
    id: "4",
    fullName: "MBA. Nguyễn Văn D",
    specialization: "Lĩnh Vực/ Chuyên Ngành",
    avatarUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=240&h=240&fit=crop&crop=face",
    academicRank: "MBA",
    experienceYears: 8,
    field: "DATA",
  },
  {
    id: "5",
    fullName: "PGS. Nguyễn Văn E",
    specialization: "Lĩnh Vực/ Chuyên Ngành",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=240&h=240&fit=crop&crop=face",
    academicRank: "PGS.TS",
    experienceYears: 20,
    field: "BUSINESS",
  },
  {
    id: "6",
    fullName: "TS. Trần Văn F",
    specialization: "Chuyên gia AI",
    avatarUrl:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=240&h=240&fit=crop&crop=face",
    academicRank: "TS",
    experienceYears: 9,
  },
  {
    id: "7",
    fullName: "ThS. Lê Văn G",
    specialization: "Chuyên gia Security",
    avatarUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&h=240&fit=crop&crop=face",
    academicRank: "ThS",
    experienceYears: 11,
  },
];

const mockCourses = [
  {
    id: 101,
    name: "MOS Word Master",
    price: 990000,
    rating: 4.8,
    lectures: 22,
    tags: ["MOS", "Word"],
    banner:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=450&fit=crop",
    level: "Cơ bản",
    duration: "12 giờ",
    overview: "Thành thạo Word phục vụ thi MOS và công việc.",
  },
  {
    id: 102,
    name: "Excel Nâng Cao",
    price: 1490000,
    rating: 4.7,
    lectures: 30,
    tags: ["MOS", "Excel"],
    banner:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop",
    level: "Nâng cao",
    duration: "18 giờ",
    overview: "Pivot, Power Query, Dashboard chuyên nghiệp.",
  },
  {
    id: 103,
    name: "PowerPoint Chuyên Nghiệp",
    price: 1290000,
    rating: 4.6,
    lectures: 18,
    tags: ["MOS", "PowerPoint"],
    banner:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop",
    level: "Cơ bản",
    duration: "10 giờ",
    overview: "Thiết kế slide thuyết phục & chuẩn thương hiệu.",
  },
  {
    id: 104,
    name: "Web Dev Cơ Bản",
    price: 1990000,
    rating: 4.5,
    lectures: 40,
    tags: ["WebDev"],
    banner:
      "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&h=450&fit=crop",
    level: "Cơ bản",
    duration: "24 giờ",
    overview: "HTML/CSS/JS & tư duy lập trình nền tảng.",
  },
  {
    id: 105,
    name: "AI cho Doanh Nghiệp",
    price: 2490000,
    rating: 4.9,
    lectures: 12,
    tags: ["AI"],
    banner:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=450&fit=crop",
    level: "Chuyên đề",
    duration: "8 giờ",
    overview: "Ứng dụng AI vào quy trình & năng suất doanh nghiệp.",
  },
];

// Custom hook để lấy dữ liệu khóa học từ API
function useCourses() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await API.public.getAllCourses();
        console.log("✅ API Response:", response);

        // Xử lý response theo cấu trúc thực tế
        let coursesData = [];

        if (response.data) {
          if (Array.isArray(response.data)) {
            coursesData = response.data;
          } else if (response.data.data && Array.isArray(response.data.data)) {
            coursesData = response.data.data;
          } else if (
            response.data.courses &&
            Array.isArray(response.data.courses)
          ) {
            coursesData = response.data.courses;
          } else {
            console.warn("⚠️ Cấu trúc response không mong đợi:", response.data);
            coursesData = [];
          }
        }

        console.log("📊 Courses data:", coursesData);

        if (coursesData.length > 0) {
          setCourses(coursesData);
        } else {
          console.warn("⚠️ Không có khóa học từ API, sử dụng mock data");
          // Fallback to mock data nếu API không trả về gì
          setCourses(mockCourses);
        }
      } catch (err: any) {
        console.error("❌ Lỗi khi lấy dữ liệu khóa học:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return { courses, loading, error };
}

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

        const response = await API.public.getTop7Lecturers();
        console.log("✅ Top 7 Lecturers API Response:", response);

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
          // Fallback to mock data nếu API không trả về gì
          setLecturers(mockInstructors);
        }
      } catch (err: any) {
        console.error("❌ Lỗi khi lấy dữ liệu giảng viên:", err);
        // Fallback to mock data khi có lỗi
        setLecturers(mockInstructors);
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
    <section className="relative font-sans text-white overflow-hidden">
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
                  <h3 className="mb-3 font-semibold">
                    Đề tài đa dạng
                  </h3>
                  <p className="text-sm leading-relaxed ">
                    Kết nối với hàng nghìn giảng viên có kinh nghiệm và chuyên
                    môn cao
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="cursor-pointer rounded-xl border-2 border-blue-200 bg-blue-50 p-6 transition-all hover:border-blue-300"
                >
                  <h3 className="mb-3 font-semibold">
                    Trường & Trung tâm
                  </h3>
                  <p className="text-sm leading-relaxed ">
                    Kết nối với hàng nghìn giảng viên có kinh nghiệm và chuyên
                    môn cao
                  </p>
                </motion.div>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="cursor-pointer rounded-xl border-2 border-blue-200 bg-blue-50 p-6 transition-all hover:border-blue-300"
              >
                <h3 className="mb-3 font-semibold">
                  Giảng viên chuyên nghiệp
                </h3>
                <p className="text-sm leading-relaxed ">
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
  const transformedLecturers = lecturers.map(lecturer => ({
    ...lecturer,
    field: lecturer.field || ['ART', 'SOFT SKILL', 'CEH', 'DATA', 'BUSINESS'][Math.floor(Math.random() * 5)],
    specialization: lecturer.specialization || "Lĩnh Vực/ Chuyên Ngành"
  }));

  return (
    <section id="giangvien">
      <LecturerCarousel 
        lecturers={transformedLecturers} 
        loading={loading} 
      />
    </section>
  );
}

function CourseSearch({ openCourse }: { openCourse: (id: number) => void }) {
  const [q, setQ] = useState("");
  const { courses, loading, error } = useCourses();

  const filtered = useMemo(
    () => {
      // Lọc khóa học đã xuất bản
      const publishedCourses = courses.filter((c) => c.published === true);
      
      // Nếu không có query tìm kiếm, hiển thị ngẫu nhiên 3 khóa học
      if (!q || q.trim() === "") {
        // Tạo bản sao để không ảnh hưởng đến mảng gốc
        const shuffled = [...publishedCourses].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, 3);
      }

      // Nếu có query tìm kiếm, hiển thị tất cả khóa học phù hợp
      return publishedCourses.filter((c) => {

        const searchTerm = q.toLowerCase().trim();
        
        // Tìm trong tất cả các trường text của khóa học
        const searchableFields = [
          c.publicTitle || "",
          c.introduce || "",
          c.publicDescription || "",
          c.address || "",
          getCourseLevel(c.level) || "",
        ];

        // Thêm giá vào search (convert to string)
        if (c.price) {
          searchableFields.push(c.price.toString());
          searchableFields.push(c.price.toLocaleString("vi-VN"));
        }

        // Tìm trong knowledge array
        if (c.knowledge && Array.isArray(c.knowledge)) {
          searchableFields.push(...c.knowledge);
        }

        // Tìm trong requirements array
        if (c.requirements && Array.isArray(c.requirements)) {
          searchableFields.push(...c.requirements);
        }

        // Tìm trong courseModules (title, description, lecturer info)
        if (c.courseModules && Array.isArray(c.courseModules)) {
          c.courseModules.forEach((module: any) => {
            // Module title và description
            if (module.title) searchableFields.push(module.title);
            if (module.description) searchableFields.push(module.description);

            // Thông tin giảng viên trong module
            if (module.lecturer) {
              const lecturer = module.lecturer;
              if (lecturer.fullName) searchableFields.push(lecturer.fullName);
              if (lecturer.academicRank)
                searchableFields.push(lecturer.academicRank);
              if (lecturer.specialization)
                searchableFields.push(lecturer.specialization);
              if (lecturer.jobField) searchableFields.push(lecturer.jobField);
              if (lecturer.bio) searchableFields.push(lecturer.bio);
            }
          });
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
    },
    [courses, q],
  );
  // Loading state
  if (loading) {
    return (
      <section
        id="khoahoc"
        className="bg-gradient-to-b from-white to-indigo-50 py-16 font-sans"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-extrabold text-gray-900 md:text-3xl">
            Khóa học nổi bật
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
        className="bg-gradient-to-b from-white to-indigo-50 py-16 font-sans"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-extrabold text-gray-900 md:text-3xl">
            Khóa học nổi bật
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
          {q && q.trim() ? `Tìm thấy ${filtered.length} khóa học` : "Khóa học nổi bật"}
        </h2>
      
        <div className="mt-8">
          {/* Search Input */}
          <div className="relative">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Tìm kiếm khóa học, giảng viên, chủ đề..."
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
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {filtered.length === 0 ? (
            <div className="col-span-3 py-8 text-center text-gray-500">
              Không tìm thấy khóa học nào phù hợp
            </div>
          ) : (
            filtered.map((c) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                key={c.id}
                className="overflow-hidden rounded-2xl bg-white shadow"
              >
                <img
                  src={
                    c.thumbnailUrl ||
                    c.banner ||
                    "https://via.placeholder.com/400x225"
                  }
                  alt={c.publicTitle || c.name}
                  className="aspect-video w-full object-cover"
                />
                <div className="p-4">
                  <div className="line-clamp-2 text-lg font-semibold leading-tight">
                    {c.publicTitle || c.name}
                  </div>
                  <div className="mt-1 text-sm text-gray-600">
                    {c.courseModules?.length || 0} bài giảng •{" "}
                    {getCourseLevel(c.level) || "Chưa xác định"}
                  </div>
                  <div className="mt-2 font-bold text-indigo-700">
                    {c.price
                      ? c.price.toLocaleString("vi-VN") + " đ"
                      : "Liên hệ"}
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <button className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-white">
                      Đăng ký khóa học
                    </button>
                    <button
                      onClick={() => openCourse(c.id)}
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

// function NewsSection() {
//   const newsItems = [
//     {
//       id: 1,
//       title: "EduHubVN ra mắt tính năng kết nối AI mới",
//       date: "15/12/2024",
//       excerpt:
//         "Nền tảng giáo dục EduHubVN vừa ra mắt tính năng kết nối AI giúp tối ưu hóa việc tìm kiếm giảng viên và khóa học phù hợp.",
//       image:
//         "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=250&fit=crop",
//     },
//     {
//       id: 2,
//       title: "Hội thảo 'Tương lai giáo dục số' tại Hà Nội",
//       date: "10/12/2024",
//       excerpt:
//         "Hội thảo quy tụ hơn 200 chuyên gia giáo dục và công nghệ để thảo luận về xu hướng giáo dục số trong tương lai.",
//       image:
//         "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop",
//     },
//     {
//       id: 3,
//       title: "EduHubVN hợp tác với 50 trường đại học",
//       date: "05/12/2024",
//       excerpt:
//         "Nền tảng EduHubVN vừa ký kết hợp tác chiến lược với 50 trường đại học hàng đầu Việt Nam.",
//       image:
//         "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
//     },
//   ];

//   return (
//     <section id="tintuc" className="bg-white py-16 font-sans">
//       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//         <h2 className="text-center text-2xl font-extrabold text-gray-900 md:text-3xl">
//           Tin tức & Sự kiện
//         </h2>
//         <div className="mt-8 grid gap-6 md:grid-cols-3">
//           {newsItems.map((item) => (
//             <motion.div
//               key={item.id}
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               className="overflow-hidden rounded-2xl bg-white shadow-lg transition-shadow hover:shadow-xl"
//             >
//               <img
//                 src={item.image}
//                 alt={item.title}
//                 className="aspect-video w-full object-cover"
//               />
//               <div className="p-6">
//                 <div className="mb-2 text-sm text-gray-500">{item.date}</div>
//                 <h3 className="mb-3 line-clamp-2 text-lg font-semibold text-gray-900">
//                   {item.title}
//                 </h3>
//                 <p className="text-sm leading-relaxed text-gray-600">
//                   {item.excerpt}
//                 </p>
//                 <button className="mt-4 text-sm font-semibold  hover:text-blue-800">
//                   Đọc thêm →
//                 </button>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

/*
 * ContactSection component - Commented out as not needed
 * This section provides contact information including address, phone, email, and working hours
 * Uses gradient background and animated cards with icons
 */

// Custom hook để lấy chi tiết khóa học từ danh sách đã có
function useCourseDetail(courseId: number, courses: any[]) {
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const findCourseDetail = () => {
      try {
        setLoading(true);
        setError(null);

        console.log(
          "🔍 Finding course detail for ID:",
          courseId,
          "in courses:",
          courses.length,
        );

        // Tìm khóa học trong danh sách đã có
        const foundCourse = courses.find((c) => c.id === courseId);

        if (foundCourse) {
          console.log(
            "✅ Found course:",
            foundCourse.publicTitle || foundCourse.name,
          );
          setCourse(foundCourse);
        } else {
          console.warn(
            "⚠️ Không tìm thấy khóa học trong danh sách, sử dụng mock data",
          );
          // Fallback to mock data nếu không tìm thấy
          const mockCourse =
            mockCourses.find((c) => c.id === courseId) || mockCourses[0];
          setCourse(mockCourse);
        }
      } catch (err: any) {
        console.error("❌ Lỗi khi tìm khóa học:", err);
        setError("Không thể tìm thấy khóa học");
      } finally {
        setLoading(false);
      }
    };

    if (courseId && courses.length > 0) {
      findCourseDetail();
    }
  }, [courseId, courses]);

  return { course, loading, error };
}

// ------------ New Pages ------------
function CourseDetail({ id, back }: { id: number; back: () => void }) {
  const { courses } = useCourses();
  const { course, loading, error } = useCourseDetail(id, courses);

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

  if (error || !course) {
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
              <p>{error || "Không tìm thấy khóa học"}</p>
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
              src={course.thumbnailUrl || "https://via.placeholder.com/400x225"}
              alt={course.publicTitle}
              className="w-full rounded-2xl shadow-lg"
            />
            <div>
              <h1 className="text-3xl font-extrabold">{course.publicTitle}</h1>
              <p className="mt-3 text-white/90">
                {course.publicDescription || course.introduce}
              </p>
              <div className="mt-4 flex flex-wrap gap-3 text-sm">
                <span className="rounded-full border border-white/30 bg-white/15 px-3 py-1">
                  Mức: {getCourseLevel(course.level)}
                </span>
                <span className="rounded-full border border-white/30 bg-white/15 px-3 py-1">
                  Thời lượng:{" "}
                  {course.courseModules?.reduce(
                    (total: number, module: any) =>
                      total + (module.duration || 0),
                    0,
                  ) || 0}{" "}
                  giờ
                </span>
                <span className="rounded-full border border-white/30 bg-white/15 px-3 py-1">
                  Bài giảng: {course.courseModules?.length || 0}
                </span>
              </div>
              <div className="mt-6 flex items-center gap-4">
                <div className="text-2xl font-extrabold">
                  {course.price
                    ? course.price.toLocaleString("vi-VN") + " đ"
                    : "Liên hệ"}
                </div>
                <button className="h-11 rounded-xl bg-amber-500 px-5 font-semibold text-white">
                  Đăng ký khóa học
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
          <div className="md:col-span-2">
            <h2 className="text-xl font-bold">Nội dung chi tiết</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {course.courseModules && course.courseModules.length > 0 ? (
                course.courseModules.map((module: any, index: number) => (
                  <li
                    key={module.id || index}
                    className="rounded-xl border bg-white p-3 shadow"
                  >
                    <div className="font-semibold">{module.title}</div>
                    <div className="mt-1 text-gray-600">
                      {module.description}
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      Thời lượng: {module.duration} giờ
                    </div>
                  </li>
                ))
              ) : (
                <>
                  <li className="rounded-xl border bg-white p-3 shadow">
                    Buổi 1–3: Tổng quan & kỹ năng nền tảng
                  </li>
                  <li className="rounded-xl border bg-white p-3 shadow">
                    Buổi 4–8: Các tính năng nâng cao / bài tập thực chiến
                  </li>
                  <li className="rounded-xl border bg-white p-3 shadow">
                    Buổi 9–12: Case study & dự án mini
                  </li>
                </>
              )}
            </ul>
          </div>
          <aside>
            {/* <h3 className="text-xl font-bold">Thông tin khóa học</h3>
            <ul className="mt-4 list-disc pl-5 text-sm text-gray-700 space-y-1">
              <li>Địa chỉ: {course.address || 'Online'}</li>
              <li>Loại hình: {course.isOnline ? 'Online' : 'Offline'}</li>
              <li>Trạng thái: {course.published ? 'Đã xuất bản' : 'Chưa xuất bản'}</li>
            </ul> */}

            {course.knowledge && course.knowledge.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-bold">Kiến thức đạt được</h3>
                <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-gray-700">
                  {course.knowledge.map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {course.requirements && course.requirements.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-bold">Yêu cầu đầu vào</h3>
                <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-gray-700">
                  {course.requirements.map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            {course.courseModules && course.courseModules.length > 0 && (
              <>
                <h3 className="mt-8 text-xl font-bold">Giảng viên</h3>
                <div className="mt-4 space-y-3">
                  {(() => {
                    // Lọc các giảng viên không trùng lặp dựa trên id
                    const uniqueLecturers = course.courseModules
                      .filter((module: any) => module.lecturer)
                      .map((module: any) => module.lecturer)
                      .filter(
                        (lecturer: any, index: number, self: any[]) =>
                          index ===
                          self.findIndex((l: any) => l.id === lecturer.id),
                      );
                    // .slice(0, 4);

                    return uniqueLecturers.map(
                      (lecturer: any, index: number) => (
                        <div
                          key={lecturer.id || index}
                          className="flex items-center gap-3 rounded-xl bg-white p-3 shadow"
                        >
                          <img
                            src={
                              lecturer.avatarUrl ||
                              "https://via.placeholder.com/48x48"
                            }
                            alt={lecturer.fullName}
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                          <div>
                            <div className="text-sm font-semibold">
                              {lecturer.fullName}
                            </div>
                            <div className="text-xs text-gray-500">
                              {getAcademicRank(lecturer.academicRank)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {lecturer.specialization}
                            </div>
                          </div>
                        </div>
                      ),
                    );
                  })()}
                </div>
              </>
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
  const [view, setView] = useState<"home" | "courseDetail" | "instructors">(
    "home",
  );
  const [courseId, setCourseId] = useState<number | null>(null);

  const openCourse = (id: number) => {
    setCourseId(id);
    setView("courseDetail");
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
          <CourseSearch openCourse={openCourse} />
          <Testimonials />
          {/* <NewsSection /> */}
        </>
      )}
      {view === "courseDetail" && courseId && (
        <>
          <CourseDetail id={courseId} back={() => setView("home")} />
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
