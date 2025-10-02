import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Avatar,
  LinearProgress,
  Alert,
} from "@mui/material";
import {
  Dashboard,
  TrendingUp,
  People,
  School,
  Business,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { API } from "../../utils/Fetch";
import { setLecturers } from "../../redux/slice/LecturerSlice";
import { setInstitutions } from "../../redux/slice/InstitutionSlice";
import { setPartner } from "../../redux/slice/PartnerSlice";
import { setCourse } from "../../redux/slice/CourseSilce";

interface StatCard {
  title: string;
  value: string | number;
  lastMonthValue: string | number;
  icon: React.ReactNode;
  color: string;
  change: string;
  trend: "up" | "down" | "stable";
}

interface QuickAction {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  route: string;
}

const AdminPage = () => {
  console.log("AdminPage: Component is being rendered!");

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const lecturers = useSelector((state: any) => state.lecturer || []);
  const institutions = useSelector((state: any) => state.institution || []);
  const partners = useSelector((state: any) => state.partner || []);
  const courses = useSelector((state: any) => state.courses || []);
  const userProfile = useSelector((state: any) => state.userProfile);

  // Thêm useEffect riêng để debug userProfile changes
  useEffect(() => {
    const fetchData = async () => {
      // Kiểm tra xem userProfile đã được load chưa
      if (!userProfile || !userProfile.role) {
        return;
      }

      if (
        lecturers.length === 0 ||
        institutions.length === 0 ||
        partners.length === 0
      ) {
        try {
          if (userProfile.role === "ADMIN") {
            const res = await API.admin.getAllLecturers();
            dispatch(setLecturers(res.data.data));
            const res2 = await API.admin.getAllInstitutions();
            dispatch(setInstitutions(res2.data.data));
            const res3 = await API.admin.getAllPartners();
            dispatch(setPartner(res3.data.data));
            const res4 = await API.admin.getAllCourses();
            dispatch(setCourse(res4.data.data));
          } else if (userProfile.role === "SUB_ADMIN") {
            if (
              userProfile.permissions &&
              userProfile.permissions.includes("LECTURER_READ")
            ) {
              const res = await API.admin.getAllLecturers();
              dispatch(setLecturers(res.data.data));
            } else {
              console.log("No LECTURER_READ permission");
            }

            if (
              userProfile.permissions &&
              userProfile.permissions.includes("SCHOOL_READ")
            ) {
              const res = await API.admin.getAllInstitutions();
              dispatch(setInstitutions(res.data.data));
            } else {
              console.log("No SCHOOL_READ permission");
            }

            if (
              userProfile.permissions &&
              userProfile.permissions.includes("ORGANIZATION_READ")
            ) {
              const res = await API.admin.getAllPartners();
              dispatch(setPartner(res.data.data));
            } else {
              console.log("No ORGANIZATION_READ permission");
            }
            if (
              userProfile.permissions &&
              userProfile.permissions.includes("COURSE_READ")
            ) {
              const res = await API.admin.getAllCourses();
              dispatch(setCourse(res.data.data));
            } else {
              console.log("No COURSE_READ permission");
            }
          }
        } catch (error) {
          console.error("Error initializing AdminPage:", error);
        }
      }
    };

    fetchData();
    setLoading(false);
  }, [
    userProfile,
    lecturers.length,
    institutions.length,
    partners.length,
    courses.length,
    dispatch,
  ]);

  const statsData: StatCard[] = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const calculateChange = (
      items: any[],
      statusField: string | null = "status",
    ): {
      currentCount: number;
      lastMonthCount: number;
      percentChange: string;
      trend: "up" | "down" | "stable";
    } => {
      if (!Array.isArray(items))
        return {
          currentCount: 0,
          lastMonthCount: 0,
          percentChange: "0%",
          trend: "stable",
        };

      const current = items.filter((item) => {
        const createdAt = new Date(item.createdAt);
        const isMatch =
          statusField === "isPublished"
            ? item[statusField] === true
            : !statusField || item[statusField] === "APPROVED";
        return (
          isMatch &&
          createdAt.getMonth() === currentMonth &&
          createdAt.getFullYear() === currentYear
        );
      }).length;

      const last = items.filter((item) => {
        const createdAt = new Date(item.createdAt);
        const isMatch =
          statusField === "isPublished"
            ? item[statusField] === true
            : !statusField || item[statusField] === "APPROVED";
        return (
          isMatch &&
          createdAt.getMonth() === lastMonth &&
          createdAt.getFullYear() === lastMonthYear
        );
      }).length;

      const diff = current - last;
      const percent = last === 0 ? 100 : Math.round((diff / last) * 100);
      const trend: "up" | "down" | "stable" =
        diff > 0 ? "up" : diff < 0 ? "down" : "stable";

      return {
        currentCount: current,
        lastMonthCount: last,
        percentChange: `${percent}%`,
        trend,
      };
    };

    // Check permissions for SUB_ADMIN
    const isAdmin = userProfile?.role === "ADMIN";
    const isSubAdmin = userProfile?.role === "SUB_ADMIN";
    const permissions = userProfile?.permissions || [];

    const hasLecturerRead =
      isAdmin || (isSubAdmin && permissions.includes("LECTURER_READ"));
    const hasSchoolRead =
      isAdmin || (isSubAdmin && permissions.includes("SCHOOL_READ"));
    const hasOrganizationRead =
      isAdmin || (isSubAdmin && permissions.includes("ORGANIZATION_READ"));
    // const hasCourseRead =
    //   isAdmin || (isSubAdmin && permissions.includes("COURSE_READ"));

    const lecturerStats = hasLecturerRead
      ? calculateChange(lecturers, "status")
      : {
          currentCount: 0,
          lastMonthCount: 0,
          percentChange: "0%",
          trend: "stable" as const,
        };
    const institutionStats = hasSchoolRead
      ? calculateChange(institutions, "status")
      : {
          currentCount: 0,
          lastMonthCount: 0,
          percentChange: "0%",
          trend: "stable" as const,
        };
    const partnerStats = hasOrganizationRead
      ? calculateChange(partners, "status")
      : {
          currentCount: 0,
          lastMonthCount: 0,
          percentChange: "0%",
          trend: "stable" as const,
        };

    // For courses, use the new API structure - courses are returned directly
    // const courseStats = hasCourseRead
    //   ? calculateChange(courses, "isPublished")
    //   : {
    //       currentCount: 0,
    //       lastMonthCount: 0,
    //       percentChange: "0%",
    //       trend: "stable" as const,
    //     };

    return [
      {
        title: "Tổng Giảng viên",
        value: hasLecturerRead
          ? lecturers.filter((l: any) => l.status === "APPROVED").length
          : "no_permission",
        lastMonthValue: hasLecturerRead
          ? lecturerStats.lastMonthCount
          : "no_permission",
        icon: <People sx={{ fontSize: 40 }} />,
        color: "#2e7d32",
        change: lecturerStats.percentChange,
        trend: lecturerStats.trend,
      },
      {
        title: "Trung tâm Đào tạo",
        value: hasSchoolRead
          ? institutions.filter((i: any) => i.status === "APPROVED").length
          : "no_permission",
        lastMonthValue: hasSchoolRead
          ? institutionStats.lastMonthCount
          : "no_permission",
        icon: <School sx={{ fontSize: 40 }} />,
        color: "#1976d2",
        change: institutionStats.percentChange,
        trend: institutionStats.trend,
      },
      {
        title: "Đối tác",
        value: hasOrganizationRead
          ? partners.filter((p: any) => p.status === "APPROVED").length
          : "no_permission",
        lastMonthValue: hasOrganizationRead
          ? partnerStats.lastMonthCount
          : "no_permission",
        icon: <Business sx={{ fontSize: 40 }} />,
        color: "#ed6c02",
        change: partnerStats.percentChange,
        trend: partnerStats.trend,
      },
      // {
      //   title: "Khóa học",
      //   value: hasCourseRead
      //     ? courses.filter((c: any) => c.course.isPublished === true).length
      //     : "no_permission",
      //   lastMonthValue: hasCourseRead
      //     ? courseStats.lastMonthCount
      //     : "no_permission",
      //   icon: <LibraryBooks sx={{ fontSize: 40 }} />,
      //   color: "#9c27b0",
      //   change: courseStats.percentChange,
      //   trend: courseStats.trend,
      // },
    ];
  }, [lecturers, institutions, partners, courses, userProfile]);

  const quickActions: QuickAction[] = [
    {
      title: "Quản lý Giảng viên",
      description: "Xem, duyệt và quản lý hồ sơ giảng viên",
      icon: <People sx={{ fontSize: 32 }} />,
      color: "#2e7d32",
      route: "/admin/lecturers",
    },
    {
      title: "Quản lý Trung tâm",
      description: "Quản lý các trung tâm đào tạo",
      icon: <School sx={{ fontSize: 32 }} />,
      color: "#1976d2",
      route: "/admin/institutions",
    },
    {
      title: "Quản lý Đối tác",
      description: "Quản lý các đối tác và doanh nghiệp",
      icon: <Business sx={{ fontSize: 32 }} />,
      color: "#ed6c02",
      route: "/admin/partners",
    },
    // {
    //   title: "Quản lý Khóa học",
    //   description: "Xem và quản lý tất cả khóa học",
    //   icon: <MenuBook sx={{ fontSize: 32 }} />,
    //   color: "#9c27b0",
    //   route: "/admin/courses",
    // },
  ];

  // Check permissions for quick actions
  const getActionPermissions = () => {
    const isAdmin = userProfile?.role === "ADMIN";
    const isSubAdmin = userProfile?.role === "SUB_ADMIN";
    const permissions = userProfile?.permissions || [];

    return {
      lecturer:
        isAdmin || (isSubAdmin && permissions.includes("LECTURER_READ")),
      school: isAdmin || (isSubAdmin && permissions.includes("SCHOOL_READ")),
      organization:
        isAdmin || (isSubAdmin && permissions.includes("ORGANIZATION_READ")),
      course: isAdmin || (isSubAdmin && permissions.includes("COURSE_READ")),
    };
  };

  const actionPermissions = getActionPermissions();

  if (loading) {
    return (
      <Box sx={{ width: "100%" }}>
        <LinearProgress />
        <Box sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6">Đang tải dữ liệu...</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Dashboard sx={{ fontSize: 32, color: "primary.main", mr: 2 }} />
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            Dashboard Quản trị
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Tổng quan hệ thống EduHubVN - Cập nhật lúc{" "}
          {new Date().toLocaleString("vi-VN")}
        </Typography>
      </Box>

      {/* Stats Cards */}
      {(actionPermissions.lecturer || actionPermissions.school || 
        actionPermissions.organization || actionPermissions.course) && (
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 4 }}>
        {statsData
          .filter((stat) => {
            // Ẩn card nếu không có quyền
            if (stat.title === "Tổng Giảng viên") return actionPermissions.lecturer;
            if (stat.title === "Trung tâm Đào tạo") return actionPermissions.school;
            if (stat.title === "Đối tác") return actionPermissions.organization;
            if (stat.title === "Khóa học") return actionPermissions.course;
            return true;
          })
          .map((stat, index) => (
          <Card
            key={index}
            sx={{
              flex: {
                xs: "1 1 100%",
                sm: "1 1 calc(50% - 12px)",
                lg: "1 1 calc(25% - 18px)",
              },
              minWidth: "250px",
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {stat.title}
                  </Typography>
                  {typeof stat.value === "string" ? (
                    <Alert
                      severity="info"
                      sx={{
                        mb: 1,
                        "& .MuiAlert-message": {
                          fontSize: "0.875rem",
                          fontWeight: "medium",
                        },
                      }}
                    >
                      Không có dữ liệu
                    </Alert>
                  ) : (
                    <>
                      <Typography
                        variant="h4"
                        sx={{ fontWeight: "bold", mb: 0.5 }}
                      >
                        {stat.value.toLocaleString()}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        Tháng trước:{" "}
                        {typeof stat.lastMonthValue === "string"
                          ? "N/A"
                          : stat.lastMonthValue.toLocaleString()}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <TrendingUp
                          sx={{ fontSize: 16, color: stat.color, mr: 0.5 }}
                        />
                        <Typography
                          variant="body2"
                          sx={{ color: stat.color, fontWeight: "bold" }}
                        >
                          {stat.change}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ ml: 0.5 }}
                        >
                          so với tháng trước
                        </Typography>
                      </Box>
                    </>
                  )}
                </Box>
                <Avatar sx={{ bgcolor: stat.color, width: 64, height: 64 }}>
                  {stat.icon}
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
      )}

      {/* Thông báo khi không có quyền */}
      {!(actionPermissions.lecturer || actionPermissions.school || 
        actionPermissions.organization || actionPermissions.course) && (
        <Card sx={{ mb: 4 }}>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Không có quyền truy cập
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Bạn không có quyền truy cập vào bất kỳ chức năng nào của hệ thống. 
              Vui lòng liên hệ quản trị viên để được cấp quyền.
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions - Full Width with 2 Columns */}
      {(actionPermissions.lecturer || actionPermissions.school || 
        actionPermissions.organization || actionPermissions.course) && (
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ fontWeight: "bold", mb: 3 }}
          >
            Thao tác nhanh
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            {quickActions
              .filter((action) => {
                // Ẩn action nếu không có quyền
                if (action.title === "Quản lý Giảng viên") return actionPermissions.lecturer;
                if (action.title === "Quản lý Trung tâm") return actionPermissions.school;
                if (action.title === "Quản lý Đối tác") return actionPermissions.organization;
                if (action.title === "Quản lý Khóa học") return actionPermissions.course;
                return true;
              })
              .map((action, index) => {
              let hasPermission = true;
              let disabledReason = "";

              // Check permissions based on action
              if (action.title === "Quản lý Giảng viên") {
                hasPermission = actionPermissions.lecturer;
                disabledReason = "Không có quyền LECTURER_READ";
              } else if (action.title === "Quản lý Trung tâm") {
                hasPermission = actionPermissions.school;
                disabledReason = "Không có quyền SCHOOL_READ";
              } else if (action.title === "Quản lý Đối tác") {
                hasPermission = actionPermissions.organization;
                disabledReason = "Không có quyền ORGANIZATION_READ";
              } else if (action.title === "Quản lý Khóa học") {
                hasPermission = actionPermissions.course;
                disabledReason = "Không có quyền COURSE_READ";
              }

              return (
                <Card
                  key={index}
                  variant="outlined"
                  sx={{
                    cursor: hasPermission ? "pointer" : "not-allowed",
                    transition: "all 0.3s ease",
                    opacity: hasPermission ? 1 : 0.5,
                    "&:hover": hasPermission
                      ? {
                          boxShadow: 2,
                          transform: "translateY(-2px)",
                        }
                      : {},
                  }}
                  onClick={() => hasPermission && navigate(action.route)}
                  title={!hasPermission ? disabledReason : ""}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        sx={{
                          bgcolor: hasPermission ? action.color : "#999",
                          mr: 2,
                        }}
                      >
                        {action.icon}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: "bold" }}
                        >
                          {action.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color={
                            hasPermission ? "text.secondary" : "error.main"
                          }
                        >
                          {hasPermission ? action.description : disabledReason}
                        </Typography>
                      </Box>
                      <Button
                        variant="outlined"
                        size="small"
                        disabled={!hasPermission}
                        sx={{
                          color: hasPermission ? action.color : "#999",
                          borderColor: hasPermission ? action.color : "#999",
                        }}
                      >
                        Xem
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        </CardContent>
      </Card>
      )}
    </Box>
  );
};

export default AdminPage;
