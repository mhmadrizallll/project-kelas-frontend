import { Route, Routes } from "react-router";
import Login from "./pages/Login";
import HomePage from "./pages/member/HomePage";
import { MemberRoute, AdminRoute, Protected } from "./components/Protected";
import AdminPage from "./AdminPage";
import { Navigate } from "react-router";
import Register from "./pages/Register";
import Users from "./pages/admin/Users";
import Books from "./pages/admin/Books";
import Rentals from "./pages/admin/Rentals";
import Dashboard from "./pages/admin/Dashboard";
import UpdateUser from "./components/admin/UpdateUser";
import UpdateBook from "./components/admin/UpdateBook";
import CreateBook from "./components/admin/CreateBook";

function App() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Login />} />

      {/* Protected Routes (Hanya bisa diakses jika login) */}
      <Route element={<Protected />}>
        {/* Member Route */}
        <Route element={<MemberRoute />}>
          <Route path="/home" element={<HomePage />} />
        </Route>

        {/* Admin Route */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminPage />}>
            <Route index element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="users/:id" element={<UpdateUser />} />

            <Route path="books" element={<Books />} />
            <Route path="books/add" element={<CreateBook />} />
            <Route path="books/:id" element={<UpdateBook />} />
            <Route path="rentals" element={<Rentals />} />
          </Route>
        </Route>
      </Route>

      {/* Jika belum login dan akses route yang tidak ada, redirect ke login */}
      <Route path="/*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
