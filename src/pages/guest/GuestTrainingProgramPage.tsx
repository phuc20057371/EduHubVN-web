import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { API } from "../../utils/Fetch";
import { setTrainingProgramsPublic } from "../../redux/slice/TrainingProgramPublicSlice";
import type { TrainingProgramPublic } from "../../types/TrainingProgram";

const GuestTrainingProgramPage = () => {
  const [q, setQ] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Function to navigate to program detail page
  const openProgramDetail = (programId: string) => {
    navigate(`/guest/training-programs/${programId}`);
  };

  // Redux
  const dispatch = useDispatch();
  const trainingPrograms = useSelector((state: any) => state.trainingProgramPublic);

  // Debug: Kiểm tra dữ liệu trainingPrograms
  console.log("🔍 GuestTrainingProgramPage - trainingPrograms:", {
    length: trainingPrograms?.length || 0,
    isArray: Array.isArray(trainingPrograms),
    data: trainingPrograms,
    loading,
    error
  });

  // Fetch training programs data
  useEffect(() => {
    const fetchTrainingPrograms = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await API.public.getAllTrainingPrograms();
        if (response.data.success) {
          dispatch(setTrainingProgramsPublic(response.data.data));
        }
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

  // Lấy tất cả tags unique từ training programs
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    trainingPrograms?.forEach((program: TrainingProgramPublic) => {
      if (program.tags && Array.isArray(program.tags)) {
        program.tags.forEach((tag: string) => tags.add(tag));
      }
    });
    return Array.from(tags).sort();
  }, [trainingPrograms]);

  const filtered = useMemo(() => {
    if (!trainingPrograms || !Array.isArray(trainingPrograms)) return [];

    // Lọc chương trình đào tạo đã được publish
    let filteredPrograms = trainingPrograms;

    // Lọc theo selected tags
    if (selectedTags.length > 0) {
      filteredPrograms = filteredPrograms.filter((p: TrainingProgramPublic) => {
        if (!p.tags || !Array.isArray(p.tags)) return false;
        return selectedTags.some((tag) => p.tags.includes(tag));
      });
    }

    // Nếu không có query tìm kiếm, hiển thị tất cả
    if (!q || q.trim() === "") {
      return filteredPrograms;
    }

    // Nếu có query tìm kiếm, hiển thị tất cả chương trình phù hợp
    return filteredPrograms.filter((p: TrainingProgramPublic) => {
      const searchTerm = q.toLowerCase().trim();

      // Tìm trong tất cả các trường text của chương trình đào tạo
      const searchableFields = [
        p.title || "",
        p.subTitle || "",
        p.shortDescription || "",
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
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <a 
              href="/"
              className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              ← Quay về trang chủ
            </a>
            <h1 className="mt-4 text-3xl font-extrabold text-gray-900">
              Tất cả chương trình đào tạo
            </h1>
          </div>
          <div className="flex justify-center py-12">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <a 
              href="/"
              className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              ← Quay về trang chủ
            </a>
            <h1 className="mt-4 text-3xl font-extrabold text-gray-900">
              Tất cả chương trình đào tạo
            </h1>
          </div>
          <div className="text-center text-red-600">
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-xl bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <a 
            href="/"
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            ← Quay về trang chủ
          </a>
          <h1 className="mt-4 text-3xl font-extrabold text-gray-900">
            Tất cả chương trình đào tạo
          </h1>
          <p className="mt-2 text-gray-600">
            {q || selectedTags.length > 0
              ? `Tìm thấy ${filtered.length} chương trình đào tạo`
              : `Hiển thị ${filtered.length} chương trình đào tạo`}
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
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
            </div>
          )}
        </div>

        {/* Training Programs Grid */}
        {filtered.length === 0 ? (
          <div className="py-12 text-center">
            <div className="mx-auto max-w-md">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Không tìm thấy chương trình đào tạo
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {q || selectedTags.length > 0
                  ? "Thử tìm kiếm với từ khóa hoặc bộ lọc khác"
                  : "Hiện tại chưa có chương trình đào tạo nào"}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {filtered.map((program: TrainingProgramPublic) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                key={program.id}
                className="overflow-hidden rounded-2xl bg-white shadow hover:shadow-lg transition-shadow duration-200"
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
                    <button className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 transition-colors">
                      Đăng ký chương trình
                    </button>
                    <button
                      onClick={() => {
                        if (program.id && program.id.trim()) {
                          openProgramDetail(program.id);
                        } else {
                          console.error("Invalid program ID:", program.id);
                        }
                      }}
                      className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                    >
                      Xem thêm
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GuestTrainingProgramPage;
