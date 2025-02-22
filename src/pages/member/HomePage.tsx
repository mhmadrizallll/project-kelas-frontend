import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";

type Book = {
  id: string;
  title: string;
  author: string;
  image: string;
  description: string;
};

const HomePage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [expandedBooks, setExpandedBooks] = useState<{
    [key: string]: boolean;
  }>({});

  const fetchBooks = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found");
        return;
      }
      const response = await axios.get("http://localhost:3000/api/v1/books", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBooks(response.data.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedBooks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="container py-5">
      <h2 className="text-center py-5">Books List</h2>
      <div className="row">
        {books.map((book) => {
          const isExpanded = expandedBooks[book.id] || false;
          const maxLength = 150; // Maksimal karakter sebelum dipotong
          const truncatedText =
            book.description.length > maxLength
              ? book.description.slice(0, maxLength) + "..."
              : book.description;

          return (
            <div key={book.id} className="col-xl-3 col-lg-4 col-md-6 p-3">
              <Card className="mb-3" style={{ height: "100%" }}>
                <Card.Img
                  variant="top"
                  src={`http://localhost:3000${book.image}`}
                  alt={book.title}
                  style={{ height: "500px", width: "100%", objectFit: "cover" }}
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{book.title}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {book.author}
                  </Card.Subtitle>
                  <Card.Text style={{ flexGrow: 1 }}>
                    {isExpanded ? book.description : truncatedText}
                    {book.description.length > maxLength && !isExpanded && (
                      <span
                        style={{
                          cursor: "pointer",
                          fontSize: "14px",
                          color: "blue",
                        }}
                        onClick={() => toggleExpand(book.id)}
                      >
                        {" "}
                        Lihat Selengkapnya
                      </span>
                    )}
                  </Card.Text>
                  <Card.Link href={`/books/${book.id}`}>
                    <Button variant="primary" className="form-control">
                      Detail
                    </Button>
                  </Card.Link>
                </Card.Body>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HomePage;
