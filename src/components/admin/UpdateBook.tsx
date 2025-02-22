import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Swal from "sweetalert2";
import axios from "axios";
import { Button, Container, Form } from "react-bootstrap";
import Select from "react-select";

interface FormState {
  code_book: string;
  title: string;
  author: string;
  image?: FileList;
  stock: number;
  description: string;
}

const schema = yup.object().shape({
  code_book: yup.string().required("Please provide a valid code_book"),
  title: yup.string().required("Please provide a valid title"),
  author: yup.string().required("Please provide a valid author"),
  stock: yup
    .number()
    .integer("Stock must be an integer")
    .required("Please provide a valid stock"),
  description: yup.string().required("Please provide a valid description"),
});

const UpdateBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [categories, setCategories] = useState<
    { label: string; value: string }[]
  >([]);
  const [selectedCategories, setSelectedCategories] = useState<
    { label: string; value: string }[]
  >([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormState>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const selectedImage = watch("image");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:3000/api/v1/category`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const categoryOptions = response.data.data.map(
          (category: { id: string; name: string }) => ({
            label: category.name,
            value: category.id,
          })
        );

        setCategories(categoryOptions);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:3000/api/v1/books/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const bookData = response.data.data;
        setValue("code_book", bookData.code_book);
        setValue("title", bookData.title);
        setValue("author", bookData.author);
        setValue("stock", bookData.stock);
        setValue("description", bookData.description);

        if (bookData.image) {
          setPreview(bookData.image);
        }

        // Atur kategori lama jika ada
        if (bookData.categories) {
          const existingCategories = bookData.categories.map(
            (category: { id: string; name: string }) => ({
              label: category.name,
              value: category.id,
            })
          );
          setSelectedCategories(existingCategories);
        }
      } catch (error) {
        console.error("Error fetching book:", error);
      }
    };

    fetchBook();
  }, [id, setValue]);

  useEffect(() => {
    if (selectedImage && selectedImage.length > 0) {
      const file = selectedImage[0];
      setPreview(URL.createObjectURL(file));
    }
  }, [selectedImage]);

  const handleUpdate = async (data: any) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to update this book?",
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

          const formData = new FormData();
          formData.append("code_book", data.code_book);
          formData.append("title", data.title);
          formData.append("author", data.author);
          formData.append("stock", data.stock.toString());
          formData.append("description", data.description);

          if (data.image?.length) {
            formData.append("image", data.image[0]);
          }

          // ✅ Ambil kategori yang dipilih
          const categoryIds = selectedCategories.map(
            (category) => category.value
          );

          // ✅ Debugging kategori sebelum dikirim
          // console.log("Final category_ids:", categoryIds);

          // ✅ Pastikan kategori dikirim sebagai array, bukan JSON string
          categoryIds.forEach((id) => formData.append("category_ids[]", id));

          await axios.put(
            `http://localhost:3000/api/v1/books/update/${id}`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
              },
            }
          );

          Swal.fire("Updated!", "Book has been updated.", "success");
          navigate("/admin/books");
        } catch (error: any) {
          console.error("Error updating book:", error);

          if (error.response && error.response.data) {
            const { message } = error.response.data;
            Swal.fire("Error!", message, "error");
          }
        } finally {
          setLoading(false);
        }
      }
    });
  };

  return (
    <Container className="mt-3">
      <h2 className="py-3">Update Book</h2>
      <Form onSubmit={handleSubmit(handleUpdate)}>
        <Form.Group className="mb-3">
          <Form.Label>Code Book</Form.Label>
          <Form.Control type="text" {...register("code_book")} />
          {errors.code_book && (
            <p className="text-danger">{errors.code_book.message}</p>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control type="text" {...register("title")} />
          {errors.title && (
            <p className="text-danger">{errors.title.message}</p>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Author</Form.Label>
          <Form.Control type="text" {...register("author")} />
          {errors.author && (
            <p className="text-danger">{errors.author.message}</p>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Image</Form.Label>
          <Form.Control type="file" accept="image/*" {...register("image")} />
          {preview && (
            <img src={preview} alt="Preview" className="mt-2" width="100" />
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Stock</Form.Label>
          <Form.Control type="number" {...register("stock")} />
          {errors.stock && (
            <p className="text-danger">{errors.stock.message}</p>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control type="text" {...register("description")} />
          {errors.description && (
            <p className="text-danger">{errors.description.message}</p>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Categories</Form.Label>
          <Select
            options={categories}
            isMulti
            value={selectedCategories}
            onChange={(selectedOptions) =>
              setSelectedCategories(
                selectedOptions as { label: string; value: string }[]
              )
            }
          />
        </Form.Group>

        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Book"}
        </Button>
      </Form>
    </Container>
  );
};

export default UpdateBook;
