import { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
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
    .typeError("Stock must be a number")
    .positive("Stock must be a positive number")
    .integer("Stock must be an integer")
    .required("Please provide a valid stock"),
  description: yup.string().required("Please provide a valid description"),
});

const CreateBook = () => {
  const navigate = useNavigate();
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
    watch,
    formState: { errors },
  } = useForm<FormState>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const selectedImage = watch("image");

  useEffect(() => {
    if (selectedImage && selectedImage.length > 0) {
      const file = selectedImage[0];
      setPreview(URL.createObjectURL(file));
    }
  }, [selectedImage]);

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

        const categoryOption = response.data.data.map(
          (category: { id: string; name: string }) => ({
            label: category.name,
            value: category.id,
          })
        );
        console.log(categoryOption);
        setCategories(categoryOption);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleCreate = async (data: any) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to create this book?",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Create",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("token");
          const categoryIds = selectedCategories.map(
            (category) => category.value
          );

          console.log("Selected Categories:", categoryIds);

          const formData = new FormData();
          formData.append("code_book", data.code_book);
          formData.append("title", data.title);
          formData.append("author", data.author);
          formData.append("stock", data.stock.toString());
          formData.append("description", data.description);

          // **Tambahkan kategori satu per satu**
          categoryIds.forEach((id) => formData.append("category_ids[]", id));

          if (data.image?.length) {
            formData.append("image", data.image[0]);
          }

          await axios.post(
            `http://localhost:3000/api/v1/books/create`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
              },
            }
          );

          //   console.log("Response:", response.data);

          Swal.fire("Created!", "Book has been created.", "success");
          navigate("/admin/books");
        } catch (error) {
          console.error("Error creating book:", error);
        }
      }
    });
  };

  return (
    <Container className="mt-3">
      <h2 className="py-3">Create Book</h2>
      <Form onSubmit={handleSubmit(handleCreate)}>
        <Form.Group className="mb-3">
          <Form.Label>Code Book</Form.Label>
          <Form.Control
            {...register("code_book")}
            type="text"
            placeholder="Code Book"
          />
          {errors.code_book && (
            <p className="text-danger">{errors.code_book.message}</p>
          )}
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            {...register("title")}
            type="text"
            placeholder="Title"
          />
          {errors.title && (
            <p className="text-danger">{errors.title.message}</p>
          )}
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Author</Form.Label>
          <Form.Control
            {...register("author")}
            type="text"
            placeholder="Author"
          />
          {errors.author && (
            <p className="text-danger">{errors.author.message}</p>
          )}
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Image</Form.Label>
          <Form.Control {...register("image")} type="file" />
          {errors.image && (
            <p className="text-danger">{errors.image.message}</p>
          )}
        </Form.Group>
        {preview && (
          <img src={preview} alt="Preview" className="mt-3" width={100} />
        )}
        <Form.Group className="mb-3">
          <Form.Label>Stock</Form.Label>
          <Form.Control
            {...register("stock")}
            type="number"
            placeholder="Stock"
          />
          {errors.stock && (
            <p className="text-danger">{errors.stock.message}</p>
          )}
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            {...register("description")}
            as="textarea"
            rows={3}
            placeholder="Description"
          />
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
            className="basic-multi-select"
            classNamePrefix="select"
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Create
        </Button>
      </Form>
    </Container>
  );
};

export default CreateBook;
