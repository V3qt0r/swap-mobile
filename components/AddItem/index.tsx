import React, { useState } from "react";
import styles from "./AddItem.module.scss";
import Navbar from "../Navbar";

const AddItem: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    categoryName: "",
    description: "",
    prize: 0 as number,
  });
  const [itemId, setItemId] = useState<number | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const baseUrl = process.env.NEXT_PUBLIC_DEV_BASE_URL;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "prize" ? parseFloat(value) : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFile(file);
      setImagePreview(URL.createObjectURL(file)); // Create a preview of the image
    }
  };

  const handleClose = () => {
    setShowPopup(false);
    setShowImagePopup(false);
    setImagePreview(null); // Reset the preview
  };

  const handleSubmit = async () => {
    if (formData.prize <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/items/register`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(
          `Item creation failed! Error: ${errorData.message || "Unknown error"}`
        );
        throw new Error(errorData.message || "Item creation failed");
      }

      const data = await response.json();
      setItemId(data.details.id);
      alert("Item created successfully!");
      setShowPopup(false);
      setShowImagePopup(true);
    } catch (error) {
      console.error("Error creating item: ", error);
      alert("Error creating item. Please try again.");
    }
  };

  const handleImageUpload = async () => {
    if (!file || !itemId) {
      alert("Please select a file and ensure the item is created.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${baseUrl}/items/upload/${itemId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(
          `Image upload failed! Error: ${errorData.message || "Unknown error"}`
        );
        throw new Error(errorData.message || "Image upload failed");
      }

      alert("Image uploaded successfully!");
      handleClose();
    } catch (error) {
      console.error("Error uploading image: ", error);
      alert("Error uploading image. Please try again.");
    }
  };

  return (
    <div className={styles.addItem}>
      <Navbar />
      <div className={styles.addB}>
        <button
          className={styles.addButton}
          onClick={() => setShowPopup(true)}
        >
          ➕
        </button>
      </div>

      {showPopup && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <button className={styles.closeButton} onClick={handleClose}>
              ✖
            </button>
            <h2>Add Item</h2>
            <div className={styles.infoGrid}>
              <input
                type="text"
                name="name"
                placeholder="Item Name"
                value={formData.name}
                onChange={handleInputChange}
                className={styles.inputField}
              />
              <input
                type="text"
                name="categoryName"
                placeholder="Category Name"
                value={formData.categoryName}
                onChange={handleInputChange}
                className={styles.inputField}
              />
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleInputChange}
                className={styles.inputField}
              ></textarea>
              <label htmlFor="prize">Prize:</label>
              <input
                type="number"
                name="prize"
                value={formData.prize}
                onChange={handleInputChange}
                className={styles.prizeField}
              />
            </div>
            <button className={styles.doneButton} onClick={handleSubmit}>
              Done
            </button>
          </div>
        </div>
      )}

      {showImagePopup && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <button className={styles.closeButton} onClick={handleClose}>
              ✖
            </button>
            <h2>Upload Image</h2>
            <div className={styles.imagePreviewContainer}>
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className={styles.imagePreview}
                />
              ) : (
                <div className={styles.imagePlaceholder}>No Image Selected</div>
              )}
            </div>
            <input
              type="file"
              onChange={handleFileChange}
              className={styles.fileInput}
            />
            <button className={styles.doneButton} onClick={handleImageUpload}>
              Upload
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddItem;
