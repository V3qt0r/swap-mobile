import React, {useState, useEffect} from "react";
import styles from "./TransactionItem.module.scss";

interface TransactionItemProps {
    transaction: {
        name: string;
        email: string;
        phoneNumber: string;
        itemName: string;
        AmountPaid: Float64Array;
        bought: boolean;
        swapped: boolean;
        ItemId: number;
    };
    onClose: () => void; 
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, onClose }) => {
    const [images, setImages] = useState<string[]>([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [imagePaths, setImagePaths] = useState<string[]>([]);
    const baseUrl = process.env.NEXT_PUBLIC_DEV_BASE_URL;

    useEffect(() => {
        const fetchImagesPath = async () => {
            try {
                const response = await fetch(`http://localhost:8089/read-all-image/${transaction.ItemId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                const data = await response.json();
                const dataArr = data.details || []

                setImagePaths(dataArr);
            } catch (error) {
                console.error("Error fetching images: ", error);
            }
        }
        fetchImagesPath();
    }, [transaction.ItemId]);

    useEffect(() => {
        const fetchImages = async () => {
            if (imagePaths.length === 0) return;

            try {
                const fetchedImages = await Promise.all(
                    imagePaths.map(async (path) => {
                        const response = await fetch(`http://localhost:8089/read-image-path?imagePath=${path}`, {
                            method: "GET",
                        },);
                        const blob = await response.blob();
                        return URL.createObjectURL(blob);
                    })
                );
                setImages(fetchedImages);
            }catch(error) {
                console.error("Error fetching images: ", error);
            }
        };
        fetchImages();
    }, [imagePaths]);


    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) => (
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        ));
    };

    const handlePreviousImage = () => {
        setCurrentImageIndex((prevIndex) => 
       (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <button className={styles.closeButton} onClick={onClose}>
                    &times;
                </button>
                <h2>Transaction Details</h2>
                <p><strong>Owner Name:</strong> {transaction.name}</p>
                <p><strong>Owner Email:</strong> {transaction.email}</p>
                <p><strong>Owner Phone Number:</strong> {transaction.phoneNumber}</p>
                <p><strong>Item Name:</strong> {transaction.itemName}</p>
                <p><strong>Amount Paid:</strong> {transaction.AmountPaid}</p>
                <p>
                    <strong>Status:</strong>{" "}
                    Status: {transaction.bought ? <span className={`${styles.badge} ${styles.bought}`}>Bought</span> : transaction.swapped ? 
                            <span className={`${styles.badge} ${styles.swapped}`}>Swapped</span> : <span className={`${styles.badge} `}>Unknown</span>}
                </p>
            </div>
            {images.length > 0 ? (
                    <div  className={styles.imageSlider}>
                        <button onClick={handlePreviousImage}>&lt;</button>
                        <img 
                            src={images[currentImageIndex]}
                            alt={`Item ${transaction.itemName}`}
                            className={styles.images}
                        />
                        <button onClick={handleNextImage}>&gt;</button>
                    </div>
                ) : (
                    <p>No image available for this item.</p>
                )}
        </div>
    );
    
};

export default TransactionItem;