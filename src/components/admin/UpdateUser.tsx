import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import { Alert, Button, Container, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Swal from "sweetalert2";

interface FormState {
  name: string;
  email: string;
  password: string;
  is_deleted: boolean;
  role: string;
}

const schema = yup.object().shape({
  name: yup
    .string()
    .trim()
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
  is_deleted: yup.boolean().required("Please provide a valid is_deleted"),
  role: yup.string().required("Please provide a valid role"),
});

const UpdateUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // react-hook-form
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormState>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  // Fetch user data by ID
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:3000/api/v1/users/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const userData = response.data.data;
        setValue("name", userData.name);
        setValue("email", userData.email);
        setValue("is_deleted", userData.is_deleted);
        setValue("role", userData.role);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [id, setValue]);

  // Handle update user
  const handleUpdate = async (data: any) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to update this user?",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Update",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setLoading(true);
          const token = localStorage.getItem("token");
          await axios.put(
            `http://localhost:3000/api/v1/users/update/${id}`,
            data,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          Swal.fire("Updated!", "User has been updated.", "success");
          navigate("/admin/users");
        } catch (error: any) {
          console.error("Error up dating user:", error);

          if (error.response && error.response.data) {
            const { message } = error.response.data;

            if (message.includes("User already deleted")) {
              Swal.fire("Error!", "User status inactive", "error");
            }
            if (message.includes("You can't update admin as admin")) {
              Swal.fire("Error!", "You can't update admin as admin", "error");
            }
          }
        } finally {
          setLoading(false);
        }
      }
    });
  };

  return (
    <Container className="mt-3">
      <h2 className="py-3">Update User</h2>
      <Form onSubmit={handleSubmit(handleUpdate)}>
        {/* Name */}
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" {...register("name")} />
          {errors.name && <p className="text-danger">{errors.name.message}</p>}
        </Form.Group>

        {/* Email */}
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" {...register("email")} />
          {errors.email && (
            <p className="text-danger">{errors.email.message}</p>
          )}
        </Form.Group>

        {/* Password */}
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" {...register("password")} />
          {errors.password && (
            <p className="text-danger">{errors.password.message}</p>
          )}
        </Form.Group>

        {/* Account Status */}
        {errors.is_deleted && (
          <Alert variant="danger">{errors.is_deleted.message}</Alert>
        )}

        <Form.Group className="mb-3">
          <Form.Label>Role</Form.Label>
          <Form.Select {...register("role")} disabled>
            <option value="admin">Admin</option>
            <option value="member">Member</option>
          </Form.Select>
          {errors.role && <p className="text-danger">{errors.role.message}</p>}
        </Form.Group>

        {/* Submit Button */}
        <Button variant="primary" type="submit">
          {loading ? "Updating..." : "Update User"}
        </Button>
      </Form>
    </Container>
  );
};

export default UpdateUser;
