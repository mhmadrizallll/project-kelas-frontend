import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Button, Container, Form } from "react-bootstrap";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken: { role: string } = jwtDecode(token);
        if (decodedToken.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/home");
        }
      } catch (error) {
        console.error(error);
        localStorage.removeItem("token");
      }
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = { email: "", password: "" };
    let isValid = true;

    // Validasi email
    if (!form.email) {
      newErrors.email = "Please provide a valid email.";
      isValid = false;
    }

    // Validasi password minimal 8 karakter
    if (form.password.length < 4) {
      newErrors.password = "Password must be at least 4 characters.";
      isValid = false;
    }

    setErrors(newErrors);
    if (!isValid) return;

    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/users/login",
        form
      );
      const token = response.data.data.token;
      localStorage.setItem("token", token);
      // decodedToken by role
      const decodedToken: { role: string } = jwtDecode(token);
      navigate(decodedToken.role === "admin" ? "/admin" : "/home");
    } catch (error) {
      console.error(error);
    }
  };

  const onSuccess = async (res: CredentialResponse) => {
    const token = res.credential;
    console.log("Google token:", token);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/users/login/auth/google",
        {
          token: token,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      const userToken = response.data.token;
      localStorage.setItem("token", userToken);

      // decoded untuk mendapatkan role
      const decodedToken: { role: string } = jwtDecode(userToken);
      console.log(decodedToken.role);
      window.location.href = "/home";
    } catch (error) {
      console.error(error);
    }
  };

  const onFailure = () => {
    console.log("Login Gagal");
  };

  return (
    <Container
      className="d-flex flex-column justify-content-center align-items-center border"
      style={{ height: "100vh" }}
    >
      {/* Hapus validated={validated} agar tidak ada ceklis */}
      <Form noValidate onSubmit={onSubmit} style={{ width: "30%" }}>
        <Form.Group>
          <Form.Label htmlFor="email">Email :</Form.Label>
          <Form.Control
            type="email"
            name="email"
            id="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Please enter your email"
            isInvalid={!!errors.email} // Menampilkan error jika ada
            isValid={form.email.length > 0 && !errors.email}
          />
          <Form.Control.Feedback type="invalid">
            {errors.email}
          </Form.Control.Feedback>
          <Form.Control.Feedback type="valid">
            Email valid
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mt-3">
          <Form.Label htmlFor="password">Password :</Form.Label>
          <Form.Control
            type="password"
            name="password"
            id="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Please enter your password"
            isInvalid={!!errors.password} // Menampilkan error jika ada
          />
          <Form.Control.Feedback type="invalid">
            {errors.password}
          </Form.Control.Feedback>
        </Form.Group>

        {/* Tidak akan terkena validasi form */}
        <Button className="form-control mt-3" variant="primary" type="submit">
          Login
        </Button>
      </Form>
      <GoogleLogin onSuccess={onSuccess} onError={onFailure}></GoogleLogin>
    </Container>
  );
};

export default Login;
