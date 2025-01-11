import React, { useState } from "react";
import styles from "./AddItem.module.scss";
import Navbar from "../Navbar"
import ImageUpload from "../ImageUpload";


// interface Close {
//     onClose: () => void;
//     isOpen: boolean;
// }

const AddItem: React.FC = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        categoryName: "",
        description: "",
        prize: 0 as number,
    })
    const [itemId, setItemId] = useState<number | null> (null)
    const baseUrl = process.env.NEXT_PUBLIC_DEV_BASE_URL;

    const handleInputChange = (e:
        React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const { name, value } = e.target;
            setFormData((prevData) => ({
                ...prevData,
                [name]: name === 'prize' ? parseFloat(value) : value,
            }));
        };

        // const handleClose = (e:
        //     React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        //         const { name, value } = e.target

    const handleSubmit = async () => {

        if (formData.prize <= 0) {
            alert("Please enter a valid amount");
            return;
        }
        try {
            const response = await fetch(`${baseUrl}/items/register`, {
                method: 'POST',
                headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            })

            if (!response.ok) {
                    alert("Item upload failed! Please try again");
                    throw new Error("Item upload failed! Please try again")
            }

            // const data = await response.json();
            // setItemId(data.ID);
            // console.log(data.ID);
            alert("Item uploaded successfully!")
            // setShowPopup(false);
            // onClose();
        } catch (error) {
            console.error("Error uploading item: ", error)
            alert("Error uploading item: ");
        }
    };

    return (
        <div className={styles.addItem}>
            <Navbar />
            <div className={styles.addB}>
            <button className={styles.addButton} onClick={() => setShowPopup(true)}>➕</button>
            </div>
            {showPopup && (<div className={styles.popup}>
                <div className={styles.popupContent}>
                <button className={styles.closeButton} onClick={() => setShowPopup(false)}>
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
                        onChange={handleInputChange} className={styles.inputField}></textarea>
                        Prize:
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
            {itemId && <ImageUpload itemId={itemId} />}
        </div>
    );
};

export default AddItem;