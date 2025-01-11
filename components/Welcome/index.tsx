import React from "react";
import { useRouter } from "next/router";
import styles from "./Welcome.module.scss"


const Welcome: React.FC = () => {
    const router = useRouter()

    //Navigate to login page
    const goToLogin = () => {
        router.push("/login");
    };

    const goToRegister = () => {
        router.push("/register");
    };

    return (
        <div className={styles.background}>
          <div className={styles.welcomeContainer}>
            <h1 className={styles.heading}>Welcome to SwapApp</h1>
            <p className={styles.decription}>Please choose an option to get started</p>
            <div className={styles.buttonContainer}>
                <button onClick={goToLogin} className={`${styles.button} ${styles.login}`}>
                    Login
                </button>
                <button onClick={goToRegister} className={`${styles.button} ${styles.register}`}>
                    Register
                </button>
            </div>
          </div>
        </div>
    );
};

export default Welcome;