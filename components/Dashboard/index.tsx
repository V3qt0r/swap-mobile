import React, { useEffect, useState } from "react"
import styles from "./Dashboard.module.scss"
import ItemButtons from "../Button"
import BuyPage from "../BuyPage"
import Navbar from "../Navbar"
import Spinner from "../Spinner";

interface Category {
    id: number;
    name: string;
}

interface Item {
    id: number;
    name: string;
    Description: string;
    Prize: Float64Array;
}


const Dashboard: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [items, setItems] = useState<Item[]>([])
    const [loadingItems, setLoadingItems] = useState(false);
    const [error, setError] = useState("");
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [isBuyModalOpen, setBuyModalOpen] = useState(false);

    const baseUrl = process.env.NEXT_PUBLIC_DEV_BASE_URL;

    useEffect (() => {
        const fetchCategories = async () => {
            console.log("Starting fetchCategories...")
            try {
                const response = await fetch(`${baseUrl}/categories/valid-categories`, {
                    method: "GET",
                    headers:  {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    },
                });
                console.log("Response status: ", response.status);
                if (!response.ok) {
                    throw new Error("Failed to fetch categories")
                }
                const data = await response.json();
                console.log("Fetched categories data: ", data)
                const categoryArray = data.details || [];
                setCategories(categoryArray);
            }catch (err) {
                console.error("Error fetching data: ", err)
                setError(err.message);
            }finally {
                console.log("Finished fetching categories")
                setLoadingCategories(false)
            }
        };

        fetchCategories();
    }, []);

    const handleCategoryClick = async (id: number) => {
        // alert("Done");

        setLoadingItems(true);
        try{
            const response = await fetch(`${baseUrl}/categories/${id}`, {
                method: "GET",
                headers:  {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                },
            });
            console.log("Response status: ", response.status);
            if (!response.ok) {
                console.log("Failed to fetch items for this category")
                throw new Error("Failed to fetch items for this category")
            }
            const data = await response.json();
            console.log("Response data: ", data)
            const itemArray = data.details || []
            setItems(itemArray);
        }catch (err) {
            console.error("Error: ", err)
            setError(err.message);
        }finally {
            setLoadingItems(false)
        }
    };

    const handleBuyClick = (item: Item) => {
        setSelectedItem(item);
        setBuyModalOpen(true)
    }

    const handlePay = async (itemId: number, amount: number) => {
        try {
            const response = await fetch(`${baseUrl}/items/buy/${itemId}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({amount}),
            });

            if (response.ok) {
                alert("Payment successful!");
                setBuyModalOpen(false);
            } else {
                const error = await response.json();
                console.error("Error response from server: ", error)
                alert(`Failed to complete purchase: ${error.error}`)
            }
            
        } catch (err) {
            console.error("Error during payment: ", err)
            alert(err.message);
        }
    };

    const handleSwapClick = (itemId: number) => {
        alert(`Swap action triggered for item ID: ${itemId}`)
    }


    if (loadingCategories) return <div className={styles.loader}>
        <Spinner />
        Loading categories...
        </div>
    if (error) return <div className={styles.error}>Error: {error}</div>

    
    return (
        <div className={styles.pageContainer}>
            <Navbar />
            
            <div className={styles.container}>
            <h1 className={styles.title}>Explore Categories</h1>
            <div className={styles.categoriesGrid}>
                {/* /*{categories.map((category) => ( */}
                    {Array.isArray(categories) && categories.map((category) => (
                    <div 
                        key = {category.id}
                        className = {styles.categoryCard}
                        onClick={() => 
                            handleCategoryClick(category.id)}>
                        <h2 className={styles.category}>{category.name}</h2>    
                    </div>
                    ))}
                {/* ))} */}
            </div>

            {loadingItems && <div className={styles.loader}> Loading items...</div>}
                {!loadingItems && items.length > 0 && (
                    <div className={styles.itemsSection}>
                        <h2>Items in Selected Categories:</h2>
                        <div className={styles.itemsGrid}>
                            {/* {items.map ((item) => ( */}
                            {Array.isArray(items) && items.map((item) => (
                                <div key={item.id} className={styles.itemCard}>
                                    {/* {item.images && item.images.length > 0 && ( */}
                                        <img
                                        src={`http://localhost:8089/read-image/${item.id}`}
                                        alt={item.name}
                                        className={styles.itemImage}
                                        // onError={()}
                                        />
                                    {/* )} */}
                                    <h3>{item.name}</h3>
                                    <p>{item.Description}</p>
                                    <p>Prize: ${item.Prize}</p>

                                    <ItemButtons
                                        itemId={item.id}
                                        onBuyClick={() => handleBuyClick(item)}
                                        onSwapClick={() => alert("Swap functionality not implemented yet.")}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/*BuyPage Model*/}
                {selectedItem && (
                    <BuyPage
                        isOpen={isBuyModalOpen}
                        onClose={() => setBuyModalOpen(false)}
                        itemId={selectedItem.id}
                        itemName={selectedItem.name}
                        itemDescription={selectedItem.Description}
                        itemPrize= {selectedItem.Prize}
                        onPay={handlePay}
                    /> 
                )}
                </div>
        </div>
    );
};

export default Dashboard;