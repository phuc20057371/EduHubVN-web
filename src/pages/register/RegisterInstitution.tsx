import { useState } from "react";
import type { EducationInstitutionType } from "../../types/InstitutionRequest";
import { Button, TextField } from "@mui/material";
import type { InstitutionRequest } from "../../types/InstitutionRequest";
import { API } from "../../utils/Fetch";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserProfile } from "../../redux/slice/userSlice";

const RegisterInstitution = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [businessRegistrationNumber, setBusinessRegistrationNumber] = useState<string>('');
  const [institutionName, setInstitutionName] = useState<string>('');
  const [institutionType, setInstitutionType] = useState<EducationInstitutionType | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [website, setWebsite] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [representativeName, setRepresentativeName] = useState<string>('');
  const [position, setPosition] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [establishedYear, setEstablishedYear] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const institutionData: InstitutionRequest = {
      businessRegistrationNumber,
      institutionName,
      institutionType: institutionType ?? "SCHOOL", // fallback nếu null
      phoneNumber,
      website,
      address,
      representativeName,
      position,
      description,
      establishedYear: establishedYear ?? new Date().getFullYear(), // fallback nếu null
    };

    try {
      const response = await API.user.registerInstitution(institutionData);
      console.log("✅ Đăng ký thành công:", response.data.data);
      const profileResponse = await API.user.getUserProfile();
      const user = profileResponse?.data?.data;
      // nếu dùng react-router
      if (user && user.role) {
        dispatch(setUserProfile(user));
        navigate("/pending-institution"); 
      } else {
        console.warn("User profile không hợp lệ:", user);
      }
    } catch (error: any) {
      alert("Có lỗi xảy ra. Vui lòng kiểm tra lại thông tin.");
    }
  };


  return (
    (
      <div className="max-w-3xl p-6 mx-auto mt-6 bg-white rounded-md shadow-md">
        <h2 className="mb-6 text-xl font-bold text-center">Đăng ký Cơ sở Giáo dục</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <TextField
            fullWidth
            placeholder="Mã số đăng ký kinh doanh"
            value={businessRegistrationNumber}
            onChange={(e) => setBusinessRegistrationNumber(e.target.value)}
          />
          <TextField
            fullWidth
            placeholder="Tên cơ sở"
            value={institutionName}
            onChange={(e) => setInstitutionName(e.target.value)}
          />
          <TextField
            fullWidth
            select
            placeholder="Loại cơ sở"
            value={institutionType ?? ''}
            onChange={(e) => setInstitutionType(e.target.value as EducationInstitutionType)}
            SelectProps={{ native: true }}
          >
            <option value="">-- Chọn loại --</option>
            <option value="SCHOOL">Trường</option>
            <option value="TRAINING_CENTER">Trung tâm</option>
          </TextField>

          <div className="flex flex-col gap-4 sm:flex-row">
            <TextField
              fullWidth
              placeholder="Số điện thoại"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <TextField
              fullWidth
              placeholder="Website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>

          <TextField
            fullWidth
            placeholder="Địa chỉ"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <div className="flex flex-col gap-4 sm:flex-row">
            <TextField
              fullWidth
              placeholder="Người đại diện"
              value={representativeName}
              onChange={(e) => setRepresentativeName(e.target.value)}
            />
            <TextField
              fullWidth
              placeholder="Chức vụ"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            />
          </div>

          <TextField
            fullWidth
            placeholder="Mô tả"
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <TextField
            fullWidth
            type="number"
            placeholder="Năm thành lập"
            value={establishedYear ?? ''}
            onChange={(e) => setEstablishedYear(+e.target.value)}
          />

          <div className="pt-4 text-center">
            <Button type="submit" variant="contained" color="primary">
              Đăng ký
            </Button>
          </div>
        </form>
      </div>
    ))
}

export default RegisterInstitution