import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Container } from "react-bootstrap";

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
}

const Rentals = () => {
  const [rentals, setRentals] = useState<Rental[]>([]);
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
          </tr>
        </thead>
        <tbody className="text-center">
          {rentals.length > 0 ? (
            rentals.map((rental, index) => (
              <tr key={rental.id}>
                <td>{index + 1}</td>
                <td>{rental.user?.name || "Unknown"}</td>
                <td>{rental.user?.email || "Unknown"}</td>
                <td>
                  <div>
                    {rental.books.length > 0 ? (
                      rental.books.map((book) => (
                        <div key={book.id}>{book.title}</div>
                      ))
                    ) : (
                      <div>No books found.</div>
                    )}
                  </div>
                </td>
                <td>{new Date(rental.rental_date).toLocaleDateString()}</td>
                <td>{new Date(rental.due_date).toLocaleDateString()}</td>
                <td>
                  {rental.return_date
                    ? new Date(rental.return_date).toLocaleDateString()
                    : "Not Returned"}
                </td>
                <td>{rental.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="text-center">
                No rentals found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default Rentals;
