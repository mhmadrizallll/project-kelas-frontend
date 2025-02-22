import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Button, Container, Form, Alert } from "react-bootstrap";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

interface LoginForm {
  email: string;
  password: string;
}

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Email must be a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .min(4, "Password must be at least 4 characters")
    .required("Password is required"),
});

const Login = () => {
  const [serverError, setServerError] = useState<string>("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken: { role: string } = jwtDecode(token);
        navigate(decodedToken.role === "admin" ? "/admin" : "/home");
      } catch (error) {
        console.error(error);
        localStorage.removeItem("token");
      }
    }
  });

  const onSubmit = async (data: LoginForm) => {
    setServerError("");
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/users/login",
        data
      );
      const token = response.data.data.token;
      localStorage.setItem("token", token);
      // decodedToken by role
      const decodedToken: { role: string } = jwtDecode(token);
      navigate(decodedToken.role === "admin" ? "/admin" : "/home");
    } catch (error: any) {
      console.log("Backend error response:", error.response); // Debugging

      if (error.response && error.response.data) {
        const { message } = error.response.data;

        // Jika email belum terdaftar
        if (message.includes("Email not registered")) {
          setError("email", {
            type: "server",
            message: "This email is not registered",
          });
        } else if (message.includes("Invalid password")) {
          setServerError("Email or Password is invalid");
        }
      }
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
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <h2 className="mb-3">Login Form</h2>
      {/* Hapus validated={validated} agar tidak ada ceklis */}
      {/* Tampilkan error global jika ada */}
      {serverError && <Alert variant="danger">{serverError}</Alert>}
      <Form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        style={{ width: "30%" }}
      >
        <Form.Group>
          <Form.Label htmlFor="email">Email :</Form.Label>
          <Form.Control
            type="email"
            id="email"
            {...register("email")}
            placeholder="Please enter your email"
            isInvalid={!!errors.email} // Menampilkan error jika ada
          />
          <Form.Control.Feedback type="invalid">
            {errors.email?.message}
          </Form.Control.Feedback>
          <Form.Control.Feedback type="valid">
            Email valid
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mt-3">
          <Form.Label htmlFor="password">Password :</Form.Label>
          <Form.Control
            type="password"
            id="password"
            {...register("password")}
            placeholder="Please enter your password"
            isInvalid={!!errors.password} // Menampilkan error jika ada
          />
          <Form.Control.Feedback type="invalid">
            {errors.password?.message}
          </Form.Control.Feedback>
        </Form.Group>

        {/* Tidak akan terkena validasi form */}
        <Button className="form-control my-3" variant="primary" type="submit">
          Login
        </Button>
      </Form>
      <GoogleLogin onSuccess={onSuccess} onError={onFailure}></GoogleLogin>
      <div className="text-center mt-3">
        <p className="m-0">You don't have an account?</p>
        <Link to="/register" className="m-0">
          Sign up?
        </Link>
      </div>
    </Container>
  );
};

export default Login;
