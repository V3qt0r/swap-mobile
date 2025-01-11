import React, { useState } from "react";
import styles from "./BuyPage.module.scss";


interface BuyPageProps {
    isOpen: boolean;
    onClose: () => void;
    itemId: number;
    itemName: string;
    itemDescription: string;
    itemPrize: Float64Array;
    // ownerName: string;
    onPay: (itemId: number, amount: number) => void;
}

const BuyPage: React.FC<BuyPageProps> = ({
    isOpen,
    onClose,
    itemId,
    itemName,
    itemPrize,
    itemDescription,
    // ownerName,
    onPay,
}) => {
    const [amount, setAmount] = useState("");

    const handlePayClick = () => {
        if (!amount || isNaN(parseFloat(amount))) {
            alert("Please enter a valid amount.");
            return;
        }

        onPay(itemId, parseFloat(amount));
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <button className={styles.closeButton} onClick={onClose}>
                    ✖
                </button>
                <h3>Buy Item</h3>
                {/* <p><strong>Owner:</strong>{ownerName}</p> */}
                <p><strong>Item ID:</strong>{itemId}</p>
                <p><strong>Item Name:<strong>{itemName}</strong></strong></p>
                <p><strong>Description:</strong>{itemDescription}</p>
                <p><strong>Item Prize: $</strong>{itemPrize}</p>
                <div className={styles.amountInput}>
                    <label>Amount:</label>
                    <input
                        type="number"
                        placeholder="Enter amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </div>
                <button className={styles.payButton} onClick={handlePayClick}>
                    Pay
                </button>
            </div>
        </div>
    );
};


export default BuyPage;