import { Row, Col } from "react-bootstrap";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import { Outlet } from "react-router";

const AdminPage = () => {
  return (
    <div className="" style={{ overflowX: "hidden" }}>
      <Row className="g-0">
        <Col md={3}>
          <Sidebar />
        </Col>
        <Col md={9}>
          <Navbar />
          <Outlet />
        </Col>
      </Row>
    </div>
  );
};

export default AdminPage;
