import React, { useEffect, useState } from "react";
import styles from "./AddItem.module.scss";
import Navbar from "../Navbar";
import ItemImage from "../ItemImage";
import { FaEllipsisV } from "react-icons/fa";
import UpdateItem from "../UpdateItem";
import DeleteItem from "../DeleteItem";
import UpdateImage from "../UpdateImage";
import { Interface } from "node:readline";



interface Item {
    id: number;
    name: string;
    description: string;
    prize: Float64Array;
    categoryName: string;
    sold: boolean;
}

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
  const [userItems, setUserItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<any[]>([]); 
  const [loadingItems, setLoadingItems] = useState(true);
  const baseUrl = process.env.NEXT_PUBLIC_DEV_BASE_URL;
  const [showDropdown, setShowDropdown] = useState<number | null>(null);
  const [updateItemId, setUpdateItemId] = useState<number | null>(null);
  const [imageId, setImageId] = useState<number | null>(null);


  useEffect (() => {
    const fetchedCategories = async () => {
      console.log("Starting fetch categories...");

      try {
        const response =await fetch(`${baseUrl}/categories/valid-categories`, {
          method: "GET",
          headers:  {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fecth user items");
        }

        const data = await response.json();
        console.log("Fetch categories: ", data);
        const allCategories = data.details || [];
        setCategories(allCategories);
      } catch (error) {
        console.error("Error fetching categories");
      }
    }
    fetchedCategories();
  }, []);

  useEffect (() => {
    const fetchedUserItems = async () => {
      console.log("Starting fetch user items...");
      try {
        const response = await fetch(`${baseUrl}/items/self`, {
          method: "GET",
          headers:  {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fecth user items");
        }

        const data = await response.json();
        console.log("Fecthed user items: ", data);
        const userItemsArray = data.details || [];
        setUserItems(userItemsArray);
      } catch(error) {
        console.error("Error fecthing data: ", error);
      } finally {
        console.log("Finished fetching user items");
        setLoadingItems(false);
      }
    }
    fetchedUserItems();
  }, []);

  useEffect(() => {
    if (updateItemId !== null) {
      document.body.classList.add(styles.noScroll);
    } else {
      document.body.classList.remove(styles.noScroll);
    }
  
    return () => {
      document.body.classList.remove(styles.noScroll); // Cleanup
    };
  }, [updateItemId]);


  useEffect(() => {
    if (imageId !== null) {
      document.body.classList.add(styles.noScroll);
    } else {
      document.body.classList.remove(styles.noScroll);
    }
  
    return () => {
      document.body.classList.remove(styles.noScroll);
    };
  }, [imageId]);
  


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


  const toggleDropdown = (itemId: number) => {
    setShowDropdown((prev) => (prev === itemId ? null : itemId));
  };


  const handleUpdate = (id: number) => {
    setUpdateItemId(id);
  };

  const handleAddImage = (id: number) => {
    setImageId(id)
  } 

  const closeUpdateModal = () => {
    setUpdateItemId(null);
    setImageId(null);
  };

  if (loadingItems) return <div className={styles.loader}>
        Loading items...
        </div>


  return (
    <div className={styles.addItem}>
      <Navbar />

      {showPopup && (
        <div className={styles.overlay}>
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

             <label> Select a Category </label>
             <select 
              name="categoryName"
              value={formData.categoryName}
              onChange={(e) => setFormData((prevData) => ({...prevData, categoryName: e.target.value,}))}
              className={styles.selectField}
              >
                <option value="" disabled>
                  -- Select a Category --
                </option>
                {categories.map((category, index) => (
                  <option key={index} value={category.name}>{category.name}</option>  
                ))}
              </select>
             

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
        </div>
      )}

      {showImagePopup && (
        <div className={styles.overlay}>
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
        </div>
      )}




        <button
          className={styles.addButton}
          onClick={() => setShowPopup(true)}
        >
          ➕
        </button>

      <div className={styles.itemsList}>
        <h3>Your Items</h3>
        {userItems.length > 0 ? (
          userItems.map((item) => (

            <div className={styles.itemCard}>
              <div className={styles.options}>
                  <FaEllipsisV
                    onClick={() => toggleDropdown(item.id)}
                    className={styles.optionsIcon}
                  />
                  {showDropdown === item.id && (
                    <div className={styles.dropdown}>
                      <p><span onClick={() => handleUpdate(item.id)}>Update</span></p>
                      <p><span onClick={() => handleAddImage(item.id)}>Add Image</span></p>
                      <DeleteItem id={item.id} />
                    </div>
                  )}
                </div>
              {updateItemId && (
                <div className={styles.update}>
                  <UpdateItem id={updateItemId} onClose={closeUpdateModal} />
                </div>
              )}

              {imageId && (
                <div className={styles.update}>
                  <UpdateImage id={imageId} onClose={closeUpdateModal} />
                </div>
              )}


            <ItemImage 
              item={item}
            />

                <h4 className={styles.itemHeader}>{item.name}</h4>
                <p className={styles.itemDetails}>{item.description}</p>
                <p className={styles.itemDetails}>Prize: ${item.prize}</p>
                <p className={styles.itemDetails}>Category: {item.categoryName}</p>
                <p>{item.sold ? <span className={`${styles.badge} ${styles.sold}`}>Sold</span> : ""}</p>
            </div>
          ))
        ) : (<p>You currently have no uploaded item</p>)}
      </div>
    </div>
  );
};

export default AddItem;



