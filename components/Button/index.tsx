import React from 'react';
import styles from "./ItemButtons.module.scss";


interface ItemButtonsProps {
    itemId: number;
    onBuyClick: (itemId: number) => void;
    onSwapClick: (itemId: number) => void;
}


const ItemButtons: React.FC<ItemButtonsProps> = ({itemId, onBuyClick, onSwapClick}) => {
    return (
        <div className={styles.itemActions}>
            <button onClick={() => onBuyClick(itemId)} className={styles.buyButton}>
                Buy
            </button>
            <button onClick={() => onSwapClick(itemId)} className={styles.swapButton}>
                Swap
            </button>
        </div>
    );
};

export default ItemButtons;