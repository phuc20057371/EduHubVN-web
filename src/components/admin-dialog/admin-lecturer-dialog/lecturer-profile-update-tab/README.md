# Lecturer Profile Update Dialog - Modular Structure

## Tổng quan
Dialog `LecturerProfileUpdateDialog` đã được tách thành 5 tab riêng biệt để dễ quản lý và bảo trì.

## Cấu trúc thư mục
```
src/components/admin-dialog/admin-lecturer-dialog/
├── LecturerProfileUpdateDialog.tsx          # Dialog chính
└── lecturer-profile-update-tab/
    ├── index.ts                            # Export tất cả tabs
    ├── LecturerProfileBasicInfoTab.tsx     # Tab thông tin cơ bản
    ├── LecturerProfileDegreesTab.tsx       # Tab bằng cấp
    ├── LecturerProfileCertificationsTab.tsx # Tab chứng chỉ
    ├── LecturerProfileCoursesTab.tsx       # Tab khóa học
    └── LecturerProfileResearchProjectsTab.tsx # Tab nghiên cứu
```

## Tabs chi tiết

### 1. LecturerProfileBasicInfoTab
- **Chức năng**: Hiển thị và chỉnh sửa thông tin cơ bản của giảng viên
- **Redux dependency**: Lắng nghe thay đổi từ `lecturerProfileUpdate` state
- **API calls**: Có thể gọi API cập nhật thông tin cơ bản
- **Props**: 
  - `onRefreshData`: Function để refresh dữ liệu sau khi cập nhật

### 2. LecturerProfileDegreesTab
- **Chức năng**: Quản lý bằng cấp của giảng viên
- **Redux dependency**: Lắng nghe `lecturerProfileUpdate.degrees`
- **Props handlers**:
  - `onAddDegree`: Thêm bằng cấp mới
  - `onEditDegree`: Chỉnh sửa bằng cấp
  - `onDeleteDegree`: Xóa bằng cấp
  - `onApproveDegreeUpdate`: Duyệt cập nhật bằng cấp
  - `onRejectDegreeUpdate`: Từ chối cập nhật bằng cấp

### 3. LecturerProfileCertificationsTab
- **Chức năng**: Quản lý chứng chỉ của giảng viên
- **Redux dependency**: Lắng nghe `lecturerProfileUpdate.certifications`
- **Props handlers**: Tương tự như DegreesTab

### 4. LecturerProfileCoursesTab
- **Chức năng**: Quản lý khóa học (sở hữu và đã tham gia)
- **Redux dependency**: Lắng nghe `lecturerProfileUpdate.ownedCourses` và `attendedCourses`
- **Props handlers**: Handlers cho cả owned và attended courses

### 5. LecturerProfileResearchProjectsTab
- **Chức năng**: Quản lý dự án nghiên cứu
- **Redux dependency**: Lắng nghe `lecturerProfileUpdate.researchProjects`
- **Props handlers**: Tương tự như các tab khác

## Redux Integration

### State Structure
```typescript
lecturerProfileUpdate: {
  lecturer: {},           // Thông tin cơ bản giảng viên
  lecturerUpdate: {},     // Yêu cầu cập nhật thông tin cơ bản
  degrees: [],           // Danh sách bằng cấp
  certifications: [],    // Danh sách chứng chỉ
  ownedCourses: [],      // Khóa học sở hữu
  attendedCourses: [],   // Khóa học đã tham gia
  researchProjects: [],  // Dự án nghiên cứu
}
```

### Automatic Updates
- Tất cả tabs sẽ tự động cập nhật khi Redux state thay đổi
- Sử dụng `useSelector` để lắng nghe thay đổi
- Không cần props drilling cho dữ liệu

## Cách sử dụng

### Import Dialog
```typescript
import LecturerProfileUpdateDialog from "./admin-dialog/admin-lecturer-dialog/LecturerProfileUpdateDialog";
```

### Sử dụng trong component
```typescript
<LecturerProfileUpdateDialog
  open={dialogOpen}
  onClose={() => setDialogOpen(false)}
  lecturer={selectedLecturer}
/>
```

## Lợi ích của cấu trúc mới

1. **Separation of Concerns**: Mỗi tab chỉ quan tâm đến chức năng riêng của nó
2. **Reusability**: Các tab có thể được tái sử dụng ở nơi khác
3. **Maintainability**: Dễ bảo trì và debug khi có lỗi
4. **Scalability**: Dễ thêm tính năng mới hoặc sửa đổi tab hiện có
5. **Redux Integration**: Tự động sync với Redux state changes
6. **Code Organization**: Code được tổ chức rõ ràng theo từng module

## Ghi chú phát triển

- Các handler functions hiện tại chỉ là placeholder (console.log)
- Cần implement đầy đủ các API calls cho CRUD operations
- Có thể thêm loading states cho các operations
- Có thể thêm validation cho từng tab
- Cần thêm error handling chi tiết hơn
