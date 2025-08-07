import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Header from "@/components/organisms/Header";
import DashboardPage from "@/components/pages/DashboardPage";
import SingleVerifyPage from "@/components/pages/SingleVerifyPage";
import BulkVerifyPage from "@/components/pages/BulkVerifyPage";
import HistoryPage from "@/components/pages/HistoryPage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white font-inter">
        <Header />
        <main className="py-8 px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/single" element={<SingleVerifyPage />} />
            <Route path="/bulk" element={<BulkVerifyPage />} />
            <Route path="/history" element={<HistoryPage />} />
          </Routes>
        </main>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          style={{ zIndex: 9999 }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;