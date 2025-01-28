import React from 'react';
import styles from './Navbar.module.scss';

const Navbar: React.FC = () => {

    return (
        <nav className={styles.navbar}>
                <ul>
                     <li><a href="/profile">Profile</a></li>
                    <li><a href="/dashboard">Dashboard</a></li>
                    <li><a href="/my-products">My-Products</a></li>
                    <li><a href="/swapped-requests">Swap-Requests</a></li>
                    <li><a href= "/history">History</a></li>
                </ul>
            </nav>
    )
}

export default Navbar;