import React, { useState } from "react";

interface ImageUploadProps {
    itemId: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ itemId }) => {
    const [image, setImage] = useState<File | null>(null);
    const baseUrl = process.env.NEXT_PUBLIC_DEV_BASE_URL;

    const handleImageUpload = async() => {
        if(!image) {
            alert("Please select an image to upload!");
            return;
        }

        try {
            const formData = new FormData();
            formData.append('image', image);
            // formData.append('itemId', itemId);

            const response = await fetch(`${baseUrl}/items/upload-image/${itemId}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
                body: formData,
            });

            if (!response.ok) throw new Error("Failed to upload image");

            alert("Image uploaded successfully!");
        } catch (error) {
            console.error("Error uploading image: ", error);
            alert("Failed to upload image please try again");
        }
    };

    return (
        <div>
            <h3>Upload Image</h3>
            <input 
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
            />
            <button onClick={handleImageUpload}>Upload Image</button>
        </div>
    );
};

export default ImageUpload;