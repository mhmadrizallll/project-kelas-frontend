import { Button, Container, Pagination, Table } from "react-bootstrap";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router";
import Swal from "sweetalert2";

interface Book {
  id: string;
  code_book: string;
  title: string;
  author: string;
  stock: number;
  is_deleted: boolean;
}

const Books = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const token = localStorage.getItem("token");

  const fetchBooks = async () => {
    try {
      if (!token) {
        console.log("No token found");
        return;
      }
      const response = await axios.get("http://localhost:3000/api/v1/books", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response.data.data);
      setBooks(response.data.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  useEffect(() => {
    fetchBooks();
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
            `http://localhost:3000/api/v1/books/delete/${id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          Swal.fire("Deleted!", "Your book has been deleted.", "success");
          fetchBooks();
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
      text: "You want to restore this book?",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Restore",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.put(
            `http://localhost:3000/api/v1/books/restore/${id}`,
            {},
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          Swal.fire("Restored!", "Your book has been restored.", "success");
          fetchBooks();
        } catch (error: any) {
          console.error("Error restoring book:", error);
          if (error.response && error.response.data) {
            const { message } = error.response.data;
            Swal.fire("Error!", message, "error");
          }
        }
      }
    });
  };

  const sortedBooks = useMemo(() => {
    return [...books].sort((a, b) => a.code_book.localeCompare(b.code_book));
  }, [books]);

  const totalPages = Math.ceil(sortedBooks.length / itemsPerPage);
  const paginatedBooks = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedBooks.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedBooks, currentPage]);
  return (
    <Container className="py-3">
      <h2 className="py-3">Books</h2>
      <Link to="/admin/books/add">
        <Button variant="primary" className="mb-3 px-3">
          Add Book
        </Button>
      </Link>
      <Table responsive striped bordered hover>
        <thead>
          <tr className="text-center">
            <th>No</th>
            <th>Code_Book</th>
            <th>Title</th>
            <th>Stock</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedBooks.length === 0 ? (
            <tr className="text-center fw-bold">
              <td colSpan={6}>No books found</td>
            </tr>
          ) : (
            paginatedBooks.map((book, index) => (
              <tr key={book.id} className="text-center">
                <td>{index + 1}</td>
                <td>{book.code_book}</td>
                <td>{book.title}</td>
                <td>
                  {book.stock > 0 ? (
                    <span className="bg-success text-white px-2 py-1 rounded">
                      Available
                    </span>
                  ) : (
                    <span className="bg-danger text-white px-2 py-1 rounded">
                      Unavailable
                    </span>
                  )}
                </td>
                <td>
                  <span
                    onClick={() => handleRestore(book.id)}
                    style={{ cursor: "pointer" }}
                    className={`px-2 py-1 rounded ${
                      book.is_deleted
                        ? "bg-danger text-white"
                        : "bg-success text-white"
                    }`}
                  >
                    {book.is_deleted ? "Deleted" : "Active"}
                  </span>
                </td>
                <td className="d-flex justify-content-center gap-2">
                  <Link to={`/admin/books/${book.id}`}>
                    <Button variant="warning">Detail</Button>
                  </Link>
                  <Button
                    onClick={() => handleDelete(book.id)}
                    variant="danger"
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      <Pagination className="d-flex justify-content-start pt-1">
        <Pagination.Prev
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        />
        {Array.from({ length: totalPages }, (_, index) => (
          <Pagination.Item
            key={index + 1}
            active={index + 1 === currentPage}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
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

export default Books;
