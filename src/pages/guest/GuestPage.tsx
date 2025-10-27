import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import GuestImage1 from "../../assets/guest1.png";
import GuestImage2 from "../../assets/guest2.png";
import LecturerCarousel from "../../components/LecturerCarousel";
import { CourseSearch } from "../../components/ProgramSection";
import { API } from "../../utils/Fetch";
import { setTrainingProgramsPublic } from "../../redux/slice/TrainingProgramPublicSlice";

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
        let lecturersData = [];
        console.log("API Response for Top Lecturers:", response.data.data);

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

// ------------ Root App ------------
export default function EduHubMockV2() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);
  const navigate = useNavigate();

  // Redux
  const dispatch = useDispatch();
  const trainingPrograms = useSelector(
    (state: any) => state.trainingProgramPublic,
  );

  // Fetch training programs data and dispatch to Redux
  useEffect(() => {
    const fetchTrainingPrograms = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await API.public.getAllTrainingPrograms();
        if (response.data.success) {
          dispatch(setTrainingProgramsPublic(response.data.data || []));
        } else {
          // API trả về success: false
          setError("Không thể tải dữ liệu chương trình đào tạo");
          dispatch(setTrainingProgramsPublic([]));
        }
      } catch (err: any) {
        console.error("❌ Lỗi khi lấy dữ liệu training programs:", err);
        setError(err.message || "Không thể tải dữ liệu chương trình đào tạo");
        dispatch(setTrainingProgramsPublic([]));
      } finally {
        setLoading(false);
        setHasFetched(true);
      }
    };

    // Chỉ fetch nếu chưa từng fetch
    if (!hasFetched) {
      fetchTrainingPrograms();
    }
  }, [dispatch, hasFetched]);

  const openProgram = (id: string) => {
    // Validation ID trước khi mở
    if (!id || !id.trim()) {
      console.error("❌ Invalid program ID:", id);
      alert("ID chương trình đào tạo không hợp lệ!");
      return;
    }

    console.log("📖 Navigating to program detail for ID:", id);
    navigate(`/guest/training-programs/${id}`);
  };

  return (
    <div className="guest-page-font min-h-screen bg-white text-gray-900">
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
    </div>
  );
}
