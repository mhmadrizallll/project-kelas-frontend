// import React from "react";
import { Link, useLocation } from "react-router";

const Sidebar = () => {
  const location = useLocation(); // 👈 Ambil lokasi saat ini

  return (
    <div className="bg-dark text-white vh-100 p-3">
      <h4 className="p-3">Admin Panel</h4>
      <hr style={{ height: "5px", backgroundColor: "white" }} />
      <ul className="list-unstyled mt-3">
        <li
          className={`mt-2 p-3 ${
            location.pathname === "/admin" ? "bg-primary rounded" : ""
          }`}
        >
          <Link
            to="/admin"
            className="text-decoration-none fs-5 text-white d-block"
          >
            Dashboard
          </Link>
        </li>
        <li
          className={`mt-2 p-3 ${
            location.pathname === "/admin/users" ? "bg-primary rounded" : ""
          }`}
        >
          <Link
            to="/admin/users"
            className="text-decoration-none fs-5 text-white d-block"
          >
            Users
          </Link>
        </li>
        <li
          className={`mt-2 p-3 ${
            location.pathname === "/admin/books" ? "bg-primary rounded" : ""
          }`}
        >
          <Link
            to="/admin/books"
            className="text-decoration-none fs-5 text-white d-block"
          >
            Books
          </Link>
        </li>
        <li
          className={`mt-2 p-3 ${
            location.pathname === "/admin/rentals" ? "bg-primary rounded" : ""
          }`}
        >
          <Link
            to="/admin/rentals"
            className="text-decoration-none fs-5 text-white d-block"
          >
            Rentals
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
