import { Button, Container, Form } from "react-bootstrap";
import axios from "axios";
import { useNavigate, Link } from "react-router";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

// Interface untuk form
interface FormState {
  name: string;
  email: string;
  password: string;
}

// Schema validasi Yup
const schema = yup.object().shape({
  name: yup
    .string()
    .transform((value) => value.toLowerCase()) // Convert ke huruf kecil semua
    .matches(/^[a-z\s]+$/, "Name must be in lowercase only") // Hanya huruf kecil dan spasi
    .required("Please provide a valid name"),
  email: yup
    .string()
    .email("Email must be a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .min(4, "Password must be at least 4 characters")
    .required("Password is required"),
});

const Register = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError, // Digunakan untuk menangani error dari backend
    formState: { errors },
  } = useForm<FormState>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  // Fungsi submit form
  const onSubmit = async (data: FormState) => {
    try {
      await axios.post("http://localhost:3000/api/v1/users/register", data);
      navigate("/login"); // Redirect ke login setelah sukses
    } catch (error: any) {
      console.log("Backend error response:", error.response); // Debugging

      if (error.response && error.response.data) {
        const { message } = error.response.data;

        if (message.includes("Name already registered")) {
          setError("name", {
            type: "server",
            message: "This name is already registered",
          });
        }
        // Jika email sudah terdaftar
        if (message.includes("Email already registered")) {
          setError("email", {
            type: "server",
            message: "This email is already registered",
          });
        }
      }
    }
  };

  return (
    <Container
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <h2>Register Account</h2>
      <Form
        noValidate
        style={{ width: "30%" }}
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Name Field */}
        <Form.Group>
          <Form.Label htmlFor="name">Name</Form.Label>
          <Form.Control
            type="text"
            id="name"
            placeholder="Input your name"
            {...register("name")}
            isInvalid={!!errors.name} // Menampilkan error jika ada
          />
          <Form.Control.Feedback type="invalid">
            {errors.name?.message}
          </Form.Control.Feedback>
        </Form.Group>

        {/* Email Field */}
        <Form.Group className="mt-3">
          <Form.Label htmlFor="email">Email</Form.Label>
          <Form.Control
            type="email"
            id="email"
            placeholder="Input your email"
            {...register("email")}
            isInvalid={!!errors.email} // Menampilkan error jika ada
          />
          <Form.Control.Feedback type="invalid">
            {errors.email?.message}
          </Form.Control.Feedback>
        </Form.Group>

        {/* Password Field */}
        <Form.Group className="mt-3">
          <Form.Label htmlFor="password">Password</Form.Label>
          <Form.Control
            type="password"
            id="password"
            placeholder="Input your password"
            {...register("password")}
            isInvalid={!!errors.password} // Menampilkan error jika ada
          />
          <Form.Control.Feedback type="invalid">
            {errors.password?.message}
          </Form.Control.Feedback>
        </Form.Group>

        {/* Submit Button */}
        <Button className="form-control my-3" variant="primary" type="submit">
          Register
        </Button>
      </Form>
      <div className="text-center mt-3">
        <p className="m-0">You have an account?</p>
        <Link to="/login" className="m-0">
          Login
        </Link>
      </div>
    </Container>
  );
};

export default Register;
