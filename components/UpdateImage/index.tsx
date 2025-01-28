import React, {useState} from "react";
import styles from "./UpdateImage.module.scss";

interface UpdateImageProps {
    id: number;
    onClose: () => void;
}


const UpdateImage: React.FC<UpdateImageProps> = ({ id, onClose }) => {
    const baseUrl = process.env.NEXT_PUBLIC_DEV_BASE_URL;
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          setFile(file);
          setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleClose = () => {
        onClose();
        setImagePreview(null); // Reset the preview
      };

    const uploadImage = async () => {
        if (!file || !id) {
            alert("Please select a file and ensure the item is already uploaded!");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch(`${baseUrl}/items/upload/${id}`, {
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
    }
    return (
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
            <button className={styles.doneButton} onClick={uploadImage}>
              Upload
            </button>
          </div>
        </div>
    )
}


export default UpdateImage;