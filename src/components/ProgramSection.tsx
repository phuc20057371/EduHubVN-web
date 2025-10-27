import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import type { TrainingProgramPublic } from "../types/TrainingProgram";

export function CourseSearch({
  openCourse,
  trainingPrograms,
  loading,
  error,
}: {
  openCourse: (id: string) => void;
  trainingPrograms: TrainingProgramPublic[];
  loading: boolean;
  error: string | null;
}) {
  const [q, setQ] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagScrollIndex, setTagScrollIndex] = useState(0);

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

  // Constants for slideshow - responsive
  const getTagsPerView = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 640) return 2; // mobile
      if (window.innerWidth < 1024) return 3; // tablet
      return 4; // desktop
    }
    return 4; // default
  };

  const [tagsPerView, setTagsPerView] = useState(getTagsPerView());

  // Tính toán số dots cần thiết - chỉ hiển thị khi cần thiết
  const totalDots = Math.ceil(allTags.length / tagsPerView);

  // Update tags per view on window resize
  useEffect(() => {
    const handleResize = () => {
      setTagsPerView(getTagsPerView());
      setTagScrollIndex(0); // Reset scroll when resizing
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handlers for slideshow navigation
  const scrollLeft = () => {
    setTagScrollIndex(Math.max(0, tagScrollIndex - tagsPerView));
  };

  const scrollRight = () => {
    const nextIndex = tagScrollIndex + tagsPerView;
    const maxIndex = Math.max(0, allTags.length - tagsPerView);
    setTagScrollIndex(Math.min(maxIndex, nextIndex));
  };

  const filtered = useMemo(() => {
    // Lọc chương trình đào tạo đã được publish
    let filteredPrograms = trainingPrograms;
    // .filter(
    //   (p) => p.programStatus === "PUBLISHED",
    // );

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
            Chương trình đào tạo nổi bật (0)
          </h2>
          <div className="mt-8 text-center">
            <p className="text-red-600">{error}</p>
            <p className="mt-2 text-gray-500">Hiển thị 0 chương trình đào tạo</p>
          </div>
        </div>
      </section>
    );
  }

  // Empty state - khi không có training programs
  if (!loading && trainingPrograms.length === 0) {
    return (
      <section
        id="khoahoc"
        className="bg-gradient-to-b from-white via-[#2596be]/10 to-[#2596be]/80 py-16 font-sans"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-extrabold text-gray-900 md:text-3xl">
            Chương trình đào tạo nổi bật (0)
          </h2>
          <div className="mt-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <p className="text-gray-600 text-xl font-medium mb-2">
              Hiện tại chưa có chương trình đào tạo nào
            </p>
            <p className="text-gray-400 text-sm">
              Các chương trình đào tạo sẽ được cập nhật sớm nhất có thể
            </p>
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
            : `Chương trình đào tạo nổi bật (${filtered.length})`}
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

          {/* Tags Filter Slideshow */}
          {allTags.length > 0 && (
            <div className="mt-4">
              <div className="relative">
                {/* Tags Container */}
                <div className="overflow-hidden">
                  <div
                    className="flex gap-3 transition-transform duration-300 ease-in-out"
                    style={{
                      transform: `translateX(-${tagScrollIndex * (150 + 12)}px)`, // 150px width + 12px gap
                    }}
                  >
                    {allTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => {
                          if (selectedTags.includes(tag)) {
                            setSelectedTags(
                              selectedTags.filter((t) => t !== tag),
                            );
                          } else {
                            setSelectedTags([...selectedTags, tag]);
                          }
                        }}
                        className={`flex-shrink-0 whitespace-nowrap rounded-sm border px-4 py-3 text-sm font-medium transition-colors ${
                          selectedTags.includes(tag)
                            ? "border-blue-600 bg-blue-600 text-white"
                            : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                        }`}
                        style={{
                          minWidth: "150px",
                          maxWidth: "150px",
                          width: "100px",
                        }}
                      >
                        <span className="block truncate text-center">
                          {tag}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Navigation Controls */}
                {totalDots > 1 && (
                  <div className="mt-3 flex items-center justify-center gap-4">
                    {/* Left Arrow */}
                    <button
                      onClick={scrollLeft}
                      disabled={tagScrollIndex === 0}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <svg
                        className="h-4 w-4 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>

                    {/* Dots indicator - chỉ hiển thị khi có hơn 1 trang */}
                    <div className="flex gap-1">
                      {Array.from({ length: totalDots }, (_, index) => (
                        <button
                          key={index}
                          onClick={() => setTagScrollIndex(index * tagsPerView)}
                          className={`h-2 w-2 rounded-full transition-colors ${
                            Math.floor(tagScrollIndex / tagsPerView) === index
                              ? "bg-blue-600"
                              : "bg-gray-300"
                          }`}
                        />
                      ))}
                    </div>

                    {/* Right Arrow */}
                    <button
                      onClick={scrollRight}
                      disabled={
                        tagScrollIndex >=
                        Math.max(0, allTags.length - tagsPerView)
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <svg
                        className="h-4 w-4 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Xem tất cả button */}
          <div className="mt-4 flex justify-end">
            <a
              href="/guest/training-programs"
              className="text-sm font-medium text-blue-600 transition-colors duration-200 hover:text-blue-800 hover:underline"
            >
              Xem tất cả →
            </a>
          </div>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {filtered.length === 0 ? (
            <div className="col-span-3 py-12 text-center">
              <div className="text-gray-400 mb-2">
                <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <p className="text-gray-500 text-lg">
                {(q && q.trim()) || selectedTags.length > 0 
                  ? "Không tìm thấy chương trình đào tạo nào phù hợp"
                  : "Hiện tại chưa có chương trình đào tạo nào"}
              </p>
              <p className="text-gray-400 text-sm mt-2">
                {(q && q.trim()) || selectedTags.length > 0 
                  ? "Hãy thử thay đổi từ khóa tìm kiếm hoặc bộ lọc"
                  : "Vui lòng quay lại sau"}
              </p>
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
