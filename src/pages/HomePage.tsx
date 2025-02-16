import axios from "axios";
import { useEffect, useState } from "react";
import { Card, Button } from "react-bootstrap";

type Book = {
  id: string;
  title: string;
  author: string;
  image: string;
};

const HomePage = () => {
  const [books, setBooks] = useState<Book[]>([]);
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

      console.log(response.data.data);
      setBooks(response.data.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);
  return (
    <div className="container py-5">
      <h2 className="text-center py-5">Books List</h2>
      <div className="row">
        {books.map((book) => (
          <div className="col-md-3">
            <Card key={book.id} className="mb-3">
              <Card.Img
                variant="top"
                src={`http://localhost:3000${book.image}`}
                alt={book.title}
              />
              <Card.Body>
                <Card.Title>{book.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {book.author}
                </Card.Subtitle>
                <Card.Text>
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </Card.Text>
                <Button variant="primary">Go somewhere</Button>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
