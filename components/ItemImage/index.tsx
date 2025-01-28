import React, { useState, useEffect } from "react";
import styles from "./ItemImage.module.scss";

interface ItemProps {
    item: {
        id: number;
        name: string;
    }
}

const ItemImage: React.FC<ItemProps> = ({ item }) => {
    const [images, setImages] = useState<string[]>([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [imagePaths, setImagePaths] = useState<string[]>([]);
    const baseUrl = process.env.NEXT_PUBLIC_DEV_BASE_URL;

    useEffect(() => {
            const fetchImagesPath = async () => {
                try {
                    const response = await fetch(`http://localhost:8089/read-all-image/${item.id}`, {
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
        }, [item.id]);

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
        <div>
            {images.length > 0 ? (
                <div className={styles.imageContainer}>
                    <img
                        src={images[currentImageIndex]}
                        alt={`Item ${item.name}`}
                        className={styles.image}
                    />
                    <div className={styles.imageControls}>
                        <button onClick={handlePreviousImage}>&lt;</button>
                        <button onClick={handleNextImage}>&gt;</button>
                        </div>
                    </div>
                    ) : (
                        <p className={styles.p}>No image available for this item.</p>
                    )}
        </div>
    )
}

export default ItemImage;