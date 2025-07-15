import { Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUserProfile } from "../../redux/slice/userSlice";
import { API } from "../../utils/Fetch";
import type { PartnerRequest } from "../../types/PartnerRequest";

const RegisterPartner = () => {

  const [businessRegistrationNumber, setBusinessRegistrationNumber] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [industry, setIndustry] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [website, setWebsite] = useState("");
  const [address, setAddress] = useState("");
  const [representativeName, setRepresentativeName] = useState("");
  const [position, setPosition] = useState("");
  const [description, setDescription] = useState("");
  const [establishedYear, setEstablishedYear] = useState<number | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const partnerData: PartnerRequest = {
      businessRegistrationNumber,
      organizationName,
      industry,
      phoneNumber,
      website,
      address,
      representativeName,
      position,
      description,
      establishedYear: establishedYear ?? new Date().getFullYear(),
    };

    try {
      const response = await API.user.registerPartner(partnerData);
      console.log("✅ Đăng ký tổ chức thành công:", response.data.data);

      const profileResponse = await API.user.getUserProfile();
      const user = profileResponse?.data?.data;

      if (user && user.role) {
        dispatch(setUserProfile(user));
        navigate("/pending-partner");
      } else {
        console.warn("User profile không hợp lệ:", user);
      }
    } catch (error) {
      alert("Có lỗi xảy ra. Vui lòng kiểm tra lại thông tin.");
    }
  };
  return (
    <div className="max-w-3xl p-6 mx-auto bg-white rounded shadow">
      <Typography variant="h5" className="mb-6 text-center">
        Đăng ký Tổ chức Đối tác
      </Typography>
      <form onSubmit={handleSubmit} className="p-6 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-800">Đăng ký Tổ chức Đối tác</h2>

        {/* 🏢 Thông tin tổ chức */}
        <div>
          <h3 className="mb-2 text-lg font-medium text-gray-700">🏢 Thông tin tổ chức</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextField fullWidth placeholder="Mã số đăng ký kinh doanh" value={businessRegistrationNumber} onChange={(e) => setBusinessRegistrationNumber(e.target.value)} />
            <TextField fullWidth placeholder="Tên tổ chức" value={organizationName} onChange={(e) => setOrganizationName(e.target.value)} />
            <TextField fullWidth placeholder="Ngành nghề" value={industry} onChange={(e) => setIndustry(e.target.value)} />
            <TextField fullWidth placeholder="Số điện thoại" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
            <TextField fullWidth placeholder="Website" value={website} onChange={(e) => setWebsite(e.target.value)} />
            <TextField fullWidth placeholder="Địa chỉ" value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>
        </div>

        {/* 👤 Người đại diện */}
        <div>
          <h3 className="mb-2 text-lg font-medium text-gray-700">👤 Người đại diện</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextField fullWidth placeholder="Tên người đại diện" value={representativeName} onChange={(e) => setRepresentativeName(e.target.value)} />
            <TextField fullWidth placeholder="Chức vụ" value={position} onChange={(e) => setPosition(e.target.value)} />
            <TextField fullWidth type="number" placeholder="Năm thành lập" value={establishedYear ?? ""} onChange={(e) => setEstablishedYear(+e.target.value)} />
          </div>
        </div>

        {/* 📝 Mô tả */}
        <div>
          <h3 className="mb-2 text-lg font-medium text-gray-700">📝 Mô tả</h3>
          <TextField
            fullWidth
            placeholder="Giới thiệu ngắn gọn về tổ chức"
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <Button type="submit" variant="contained" fullWidth className="!mt-6">
          Đăng ký
        </Button>
      </form>

    </div>
  )
}

export default RegisterPartner