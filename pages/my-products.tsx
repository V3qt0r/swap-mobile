import React, { useState } from "react";
import AddItem from "@/components/AddItem";

const AddItemPage: React.FC = () => {
    // const [isPopupVisible, setIsPopupVisible] = useState(true);
    // const handleClose = () => {
    //     setIsPopupVisible(false);
    // };

    return (
        <div>
            <AddItem />
        </div>
    );
};

export default AddItemPage;

// onClose={handleClose}