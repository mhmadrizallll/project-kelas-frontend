import axios from "axios";
import { useEffect, useState } from "react";
import { Row, Col, Card, Container } from "react-bootstrap";

const Dashboard = () => {
  const [users, setUsers] = useState("");
  const [books, setBooks] = useState("");
  const [rentals, setRentals] = useState("");
  const token = localStorage.getItem("token");
  // fetch Users
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/v1/users/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userAmount = response.data.data;
      setUsers(userAmount);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/v1/books/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const bookAmount = response.data.data;
      setBooks(bookAmount);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRentals = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/v1/rentals/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const rentalAmount = response.data.data;
      setRentals(rentalAmount);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchBooks();
    fetchRentals();
  }, []);
  return (
    <Container className="py-3">
      <h2 className="mb-3">Dashboard</h2>
      <Row>
        <Col md={4}>
          <Card className="mb-3 bg-danger text-white">
            <Card.Body className="d-flex justify-content-between">
              <Card.Title>Total Users </Card.Title>
              <Card.Title>{users.length}</Card.Title>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-3 bg-warning text-white">
            <Card.Body className="d-flex justify-content-between">
              <Card.Title>Total Books </Card.Title>
              <Card.Title>{books.length}</Card.Title>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-3 bg-success text-white">
            <Card.Body className="d-flex justify-content-between">
              <Card.Title>Total Rentals </Card.Title>
              <Card.Title>{rentals.length}</Card.Title>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
