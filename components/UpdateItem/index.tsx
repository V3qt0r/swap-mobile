import React, { useState} from "react";
import styles from "./UpdateItem.module.scss";

interface UpdateItemProps {
    id: number;
    onClose: () => void; // New prop to close modal
  }
  
  const UpdateItem: React.FC<UpdateItemProps> = ({ id, onClose }) => {
    const baseUrl = process.env.NEXT_PUBLIC_DEV_BASE_URL;
    const [formData, setFormData] = useState({
      name: "",
      description: "",
      prize: 0,
    });
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: name === "prize" ? parseFloat(value) : value,
      }));
    };
  
    const handleSubmit = async () => {
  
      try {
        const response = await fetch(`${baseUrl}/items/${id}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          alert(`Update failed: ${errorData.message || "Unknown error"}`);
          return;
        }
  
        alert("Item updated successfully!");
        onClose(); // Close the modal
      } catch (error) {
        console.error("Error updating item:", error);
        alert("Failed to update item.");
      }
    };
  
    return (
      <div className={styles.overlay}>
        <div className={styles.popup}>
          <button className={styles.closeButton} onClick={onClose}>
            ✖
          </button>
          <h2>Update Item</h2>
          <input
            type="text"
            name="name"
            placeholder="Item Name"
            value={formData.name}
            onChange={handleInputChange}
            className={styles.inputField}
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleInputChange}
            className={styles.inputField}
          />
          <input
            type="number"
            name="prize"
            placeholder="Prize"
            value={formData.prize}
            onChange={handleInputChange}
            className={styles.inputField}
          />
          <button className={styles.doneButton} onClick={handleSubmit}>
            Update
          </button>
        </div>
      </div>
    );
  };
  

export default UpdateItem;