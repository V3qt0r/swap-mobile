import React, {useEffect, useState} from "react";
import styles from "./History.module.scss";
import Navbar from "../Navbar"
import TransactionItem from "../TransactionItem";

interface Transaction {
    name: string;
    email: string;
    phoneNumber: string;
    itemName: string;
    ItemId: number;
    ownerId: number;
    bought: boolean;
    swapped: boolean;
    AmountPaid: Float64Array;
}


const History: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
    const baseUrl = process.env.NEXT_PUBLIC_DEV_BASE_URL;

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await fetch(`${baseUrl}/users/transaction`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    },
                });
    
                if (!response.ok) {
                    throw new Error ("Failed to fetch transactions")
                }
    
                const data = await response.json();
                const transactionsArr = data.details || []
                console.log(transactionsArr.AmountPaid)
                setTransactions(transactionsArr);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        
        fetchTransactions();
    }, []);

    const handleTransactionClick = (transaction: Transaction) => {
        setSelectedTransaction(transaction)
    }

    const handleCloseTransactionItem = () => {
        setSelectedTransaction(null)
    }

    if (loading) return <div className={styles.loader}>Loading transactions...</div>;
    if (error) return <div className={styles.error}>Error: {error}</div>;

    return (
        <div className={styles.pageContainer}>
            <Navbar />
        < div className={styles.container}>
            <h1 className={styles.title}>Transaction History</h1>
           
            {transactions.length === 0 ? (
                 <div className={styles.emptyGrid}>
                <p className={styles.noData}>You have not made any transaction yet!</p>
                </div>
            ): (
                <div className={styles.transactionGrid}>
                    {transactions.map((transaction, index) => (
                        <div key = {index} className={styles.transactionCard} onClick={() => handleTransactionClick(transaction)}>
                            <h3>{transaction.itemName}</h3>
                            <p>Amount Paid: ${transaction.AmountPaid}</p>
                            <p>Status: {transaction.bought ? <span className={`${styles.badge} ${styles.bought}`}>Bought</span> : transaction.swapped ? 
                            <span className={`${styles.badge} ${styles.swapped}`}>Swapped</span> : <span className={`${styles.badge} `}>Unknown</span>}</p>
                        </div>
                    ))}
                </div>
            )}
            {selectedTransaction && (
                <TransactionItem 
                    transaction={selectedTransaction}
                    onClose={handleCloseTransactionItem}
                />
            )}
        </div>
        </div>
    );
};

export default History;