import { useEffect, useState, useMemo } from "react";
import { Button, Table, Pagination, Container } from "react-bootstrap";
import { Link } from "react-router";
import axios from "axios";
import Swal from "sweetalert2";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  is_deleted: boolean;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/v1/users/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(
            `http://localhost:3000/api/v1/users/delete/${id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          Swal.fire("Deleted!", "User has been deleted.", "success");
          fetchUsers();
        } catch (error: any) {
          if (error.response && error.response.data) {
            const { message } = error.response.data;
            Swal.fire("Error!", message, "error");
          }
        }
      }
    });
  };

  const handleRestore = async (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to restore this user?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, restore it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.put(
            `http://localhost:3000/api/v1/users/restore/${id}`,
            {},
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          Swal.fire("Restored!", "User has been restored.", "success");
          fetchUsers();
        } catch (error: any) {
          console.error(error);
        }
      }
    });
  };

  // 🔹 **Sorting A-Z by Name**
  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => a.name.localeCompare(b.name));
  }, [users]);

  // 🔹 **Pagination Logic**
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedUsers, currentPage]);

  return (
    <Container className="py-3">
      <h2 className="py-3">Users</h2>

      <Table striped bordered hover responsive>
        <thead>
          <tr className="text-center">
            <th>No</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedUsers.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center fw-bold">
                No data available
              </td>
            </tr>
          ) : (
            paginatedUsers.map(
              ({ id, name, email, role, is_deleted }, index) => (
                <tr key={id} className="text-center">
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td>{name}</td>
                  <td>{email}</td>
                  <td>{role}</td>
                  <td>
                    <span
                      onClick={() => handleRestore(id)}
                      style={{ cursor: "pointer" }}
                      className={`py-1 px-2 rounded ${
                        is_deleted
                          ? "bg-danger text-white"
                          : "bg-success text-white"
                      }`}
                    >
                      {is_deleted ? "Inactive" : "Active"}
                    </span>
                  </td>
                  <td className="d-flex justify-content-center gap-2">
                    <Link to={`/admin/users/${id}`}>
                      <Button variant="warning">Detail</Button>
                    </Link>
                    <Button onClick={() => handleDelete(id)} variant="danger">
                      Delete
                    </Button>
                  </td>
                </tr>
              )
            )
          )}
        </tbody>
      </Table>

      {/* 🔹 **Pagination Controls** */}
      <Pagination className="d-flex justify-content-start pt-1">
        <Pagination.Prev
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        />
        {Array.from({ length: totalPages }, (_, i) => (
          <Pagination.Item
            key={i + 1}
            active={i + 1 === currentPage}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        />
      </Pagination>
    </Container>
  );
};

export default Users;
