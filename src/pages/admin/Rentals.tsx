import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Table, Container, Pagination } from "react-bootstrap";

interface User {
  id: string;
  name: string;
  email: string;
}

interface Book {
  id: string;
  title: string;
  author: string;
  code_book: string;
}

interface Rental {
  id: string;
  user: User;
  books: Book[];
  rental_date: string;
  due_date: string;
  return_date: string | null;
  status: string;
  fine: number;
}

const Rentals = () => {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const token = localStorage.getItem("token");

  const fetchRentals = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/v1/rentals", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response.data.data);
      setRentals(response.data.data);
    } catch (error) {
      console.error("Error fetching rentals:", error);
    }
  };

  useEffect(() => {
    fetchRentals();
  }, []);

  const sortRentals = useMemo(() => {
    return [...rentals].sort(
      (a, b) =>
        new Date(b.rental_date).getTime() - new Date(a.rental_date).getTime()
    );
  }, [rentals]);

  const totalPages = Math.ceil(rentals.length / itemsPerPage);
  const paginatedRental = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;

    return sortRentals.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, sortRentals]);

  return (
    <Container className="mt-3">
      <h2 className="py-3">Rental List</h2>
      <Table striped bordered hover>
        <thead className="text-center">
          <tr>
            <th>No</th>
            <th>User</th>
            <th>Email</th>
            <th>Books</th>
            <th>Rental Date</th>
            <th>Due Date</th>
            <th>Return Date</th>
            <th>Status</th>
            <th>Denda</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {paginatedRental.length === 0 ? (
            <tr>
              <td colSpan={8}>No rentals found</td>
            </tr>
          ) : (
            paginatedRental.map((rental, index) => (
              <tr key={rental.id}>
                <td>{index + 1}</td>
                <td>{rental.user.name}</td>
                <td>{rental.user.email}</td>
                <td>{rental.books.map((book) => book.title).join(", ")}</td>
                <td>{new Date(rental.rental_date).toLocaleDateString()}</td>
                <td>{new Date(rental.due_date).toLocaleDateString()}</td>
                <td>
                  {rental.return_date
                    ? new Date(rental.return_date).toLocaleDateString()
                    : "Not Returned"}
                </td>
                <td>{rental.status}</td>
                <td>
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    maximumFractionDigits: 0,
                  }).format(Number(rental.fine))}
                </td>
              </tr>
            ))
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

export default Rentals;
