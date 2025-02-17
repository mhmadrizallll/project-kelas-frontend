import { Route, Routes } from "react-router";
import Login from "./pages/Login";
import HomePage from "./pages/HomePage";
import { MemberRoute, AdminRoute, Protected } from "./components/Protected";
import AdminPage from "./pages/AdminPage";
import { Navigate } from "react-router";

function App() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/" element={<Login />} />

      {/* Protected Routes (Hanya bisa diakses jika login) */}
      <Route element={<Protected />}>
        {/* Member Route */}
        <Route element={<MemberRoute />}>
          <Route path="/home" element={<HomePage />} />
        </Route>

        {/* Admin Route */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminPage />} />
        </Route>
      </Route>

      {/* Jika belum login dan akses route yang tidak ada, redirect ke login */}
      <Route path="/*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
