import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import { Button, Container } from "react-bootstrap";

type Book = {
  id: string;
  title: string;
  author: string;
  description: string;
  image: string;
  stock: number;
};

const RentalBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("No token found");
          return;
        }
        const response = await axios.get(
          `http://localhost:3000/api/v1/books/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setBook(response.data.data);
      } catch (error) {
        console.error("Error fetching book:", error);
      }
    };

    fetchBook();
  }, [id]);

  if (!book) return <p>Loading...</p>;

  const handleRental = async () => {
    if (!book || !book.id) {
      console.error("Book data is not loaded yet!");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const bookIdsS = [book.id];

      const response = await axios.post(
        "http://localhost:3000/api/v1/rentals/create",
        { books_ids: bookIdsS },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response.data);
      alert(response.data.message || "Rental success!");
      navigate("/books");
    } catch (error: any) {
      console.error("Error rental book:", error);
      alert(error.response?.data?.message || "Failed to rent book");
    }
  };

  return (
    <Container className="my-5">
      <h2 className="mb-4 text-center">Book Detail</h2>
      <div className="row d-flex align-items-center justify-content-center">
        <div className="col-md-4">
          <img
            src={`http://localhost:3000${book.image}`}
            alt={book.title}
            className="img-fluid"
            style={{ width: "100%" }}
          />
        </div>
        <div className="col-md-8">
          <h3>{book.title}</h3>
          <p>
            <strong>Author:</strong> {book.author}
          </p>
          <p>
            <strong>Stock:</strong> {book.stock}
          </p>
          <p>
            <strong>Description:</strong> {book.description}
          </p>
          <Button
            className="px-5"
            variant="primary"
            onClick={handleRental}
            disabled={book.stock <= 0} // 🚀 Disable tombol jika stok habis
          >
            {book.stock > 0 ? "Rental" : "Out of Stock"}
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default RentalBook;
