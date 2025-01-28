import React, { useEffect, useState } from "react"
import styles from "./Dashboard.module.scss"
import ItemButtons from "../Button"
import BuyPage from "../BuyPage"
import Navbar from "../Navbar"
import Spinner from "../Spinner";
import ItemImage from "../ItemImage";

interface Category {
    id: number;
    name: string;
}

interface Item {
    id: number;
    name: string;
    Description: string;
    prize: Float64Array;
    userEmail?: string;
    userName?: string;
}

const Dashboard: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [items, setItems] = useState<Item[]>([]);
    const [loadingItems, setLoadingItems] = useState(false);
    const [error, setError] = useState("");
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [isBuyModalOpen, setBuyModalOpen] = useState(false);

    const baseUrl = process.env.NEXT_PUBLIC_DEV_BASE_URL;

    // Fetch Categories on Mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${baseUrl}/categories/valid-categories`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) throw new Error("Failed to fetch categories");
                const data = await response.json();
                setCategories(data.details || []);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoadingCategories(false);
            }
        };

        fetchCategories();
    }, [baseUrl]);

    // Fetch Items for Selected Category
    const handleCategoryClick = async (id: number) => {
        setLoadingItems(true);
        try {
            const response = await fetch(`${baseUrl}/categories/${id}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) throw new Error("Failed to fetch items for this category");
            const data = await response.json();
            setItems(data.details || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoadingItems(false);
        }
    };

    // Fetch User Details
    const handleGetUser = async (itemId: number): Promise<{ email: string; userName: string } | null> => {
        try {
            const response = await fetch(`${baseUrl}/users/details/${itemId}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) throw new Error("Failed to fetch user details");
            const data = await response.json();
            return { email: data.details.email, userName: data.details.userName };
        } catch (err: any) {
            setError(err.message);
            return null;
        }
    };

    // Fetch User Details for Items
    useEffect(() => {
        const fetchUserDetails = async () => {
            if (items.length === 0) return;

            try {
                const updatedItems = await Promise.all(
                    items.map(async (item) => {
                        if (!item.userEmail || !item.userName) {
                            const userDetails = await handleGetUser(item.id);
                            return {
                                ...item,
                                userEmail: userDetails?.email || "N/A",
                                userName: userDetails?.userName || "N/A",
                            };
                        }
                        return item;
                    })
                );
                setItems(updatedItems);
            } catch (err: any) {
                setError("Failed to fetch user details.");
            }
        };

        fetchUserDetails();
    }, [items]);

    const handleBuyClick = (item: Item) => {
        setSelectedItem(item);
        setBuyModalOpen(true);
    };

    const handlePay = async (itemId: number, amount: number) => {
        try {
            const response = await fetch(`${baseUrl}/items/buy/${itemId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ amount }),
            });

            if (response.ok) {
                alert("Payment successful!");
                setBuyModalOpen(false);
            } else {
                const error = await response.json();
                alert(`Failed to complete purchase: ${error.error}`);
            }
        } catch (err: any) {
            alert(err.message);
        }
    };

    if (loadingCategories) return <div className={styles.loader}><Spinner />Loading categories...</div>;
    if (error) return <div className={styles.error}>Error: {error}</div>;

    return (
        <div className={styles.pageContainer}>
            <Navbar />
            <div className={styles.container}>
                <h1 className={styles.title}>Explore Categories</h1>
                <div className={styles.categoriesGrid}>
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className={styles.categoryCard}
                            onClick={() => handleCategoryClick(category.id)}
                        >
                            <h2 className={styles.category}>{category.name}</h2>
                        </div>
                    ))}
                </div>
                {loadingItems && <div className={styles.loader}>Loading items...</div>}
                {!loadingItems && items.length > 0 && (
                    <div className={styles.itemsSection}>
                        <h2>Items in Selected Category:</h2>
                        <div className={styles.itemsGrid}>
                            {items.map((item) => (
                                <div key={item.id} className={styles.itemCard}>
                                    <ItemImage item={item} />
                                    <p>Email: {item.userEmail || "Loading..."}</p>
                                    <p>Username: {item.userName || "Loading..."}</p>
                                    <h3>{item.name}</h3>
                                    <p>{item.Description}</p>
                                    <p>Prize: ${item.prize}</p>
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
                {selectedItem && (
                    <BuyPage
                        isOpen={isBuyModalOpen}
                        onClose={() => setBuyModalOpen(false)}
                        itemId={selectedItem.id}
                        itemName={selectedItem.name}
                        itemDescription={selectedItem.Description}
                        itemPrize={selectedItem.prize}
                        onPay={handlePay}
                    />
                )}
            </div>
        </div>
    );
};

export default Dashboard;