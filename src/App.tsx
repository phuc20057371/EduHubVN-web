import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  useEffect(() => {
    const handleAuthMessage = (event: MessageEvent) => {
      const allowedOrigins = [
        "http://localhost:8080",
        "http://localhost:3000",
        "http://localhost:5173",
        "http://172.16.10.25",
        "*"
      ];
      if (!allowedOrigins.includes(event.origin)) return;

      const authResponse = event.data.authResponse;
      if (authResponse) {
        localStorage.setItem("accessToken", authResponse.accessToken);
        localStorage.setItem("refreshToken", authResponse.refreshToken);
        window.location.href = "/";
      }
    };

    window.addEventListener("message", handleAuthMessage);
    return () => window.removeEventListener("message", handleAuthMessage);
  }, []);

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        pauseOnHover
        closeOnClick
        draggable
        hideProgressBar={false}
        newestOnTop={true}
      />
    </>
  );
}

export default App;
