import React from "react";

interface DeleteItemProps {
    id: number;
    // onDelete: (id: number) => void;
}

const DeleteItem: React.FC<DeleteItemProps> = ({id}) => {
    const baseUrl = process.env.NEXT_PUBLIC_DEV_BASE_URL;

    const handleDelete = async () => {
        try {
            const response = await fetch(`${baseUrl}/items/${id}`,{
                method: "DELETE", 
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert(`Delete failed: ${errorData.message || "Unknown error"}`);
                return;
            }
            alert("Item deleted successfully!");
            // onDelete(id);
        } catch (error) {
            console.error("Error deleting item:", error);
             alert("Failed to delete item.");
        };
    };

    return (
        <div>
            <p onClick={handleDelete}>Delete</p>
        </div>
    )
} 


export default DeleteItem;