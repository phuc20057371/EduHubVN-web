import { useState } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate()
  const [selected, setSelected] = useState("lecturer");
  const options = [
    { value: "lecturer", label: "Giảng viên" },
    { value: "institution", label: "Trung tâm đào tạo" },
    { value: "partner", label: "Đơn vị đối tác" },
  ];

  const handleClick = () => {
    if (selected == "lecturer") {
      navigate("/register-lecturer")
    }
    else if (selected == "institution") {
      navigate("/register-institution")
    }
    else if (selected == "partner") {
      navigate("/register-partner")
    }
  }
  return (
    <div className="flex flex-col items-center gap-4 px-2 py-2">
      <div className="flex flex-row gap-4">
        {options.map((option) => (
          <div
            key={option.value}
            onClick={() => setSelected(option.value)}
            className={`cursor-pointer border px-4 py-2 rounded-lg 
      transition-all duration-200 ease-in-out transform
      ${selected === option.value
                ? "bg-blue-500 text-white border-blue-700 shadow-md scale-105"
                : "bg-white text-gray-700 border-gray-300 hover:bg-blue-100 hover:text-blue-700 hover:shadow"
              } active:scale-95`}
          >
            {option.label}
          </div>
        ))}

      </div>

      <div>
        <button className="px-4 py-2 text-white bg-blue-500 rounded border-spacing-1 hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
          onClick={handleClick}
        >
          Tiếp tục
        </button>
      </div>
    </div>
  )
}

export default HomePage