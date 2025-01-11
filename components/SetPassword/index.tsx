import React, { useState } from "react";
import { useRouter } from "next/router";
import styles from "./SetPassword.module.scss";

const SetPassword: React.FC = () => {
    const [password, SetPassword] = useState("");
    const [confirmPassword, SetConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const baseUrl = process.env.NEXT_PUBLIC_DEV_BASE_URL;

    const handleSubmit = async () => {
        if (password !== confirmPassword){
            alert("Passwords do not match");
            return;
        }

        //Simulate sending all registration data
        const userData = {
            ...JSON.parse(localStorage.getItem("registerData") || "{}"),
            password,
        };

        try {
            setLoading(true);

            const response = await fetch(
                `${baseUrl}/user/register`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(userData),
                }
            );

            if (!response.ok){
                alert("Registration failed! Please try again");
                throw new Error(("Registration failed! Please try again"))
            }

            const result = await response.json()
            console.log("Registration successful! ", result);

            alert("Registration successful! Redirecting to login...")
            localStorage.removeItem("registerData")
            router.push("/login")
        } catch(error) {
            console.log("Error during registration: ", error);
            alert("Registration failed please try again");
        }finally {
            setLoading(false)
        }
    };

    return(
        <div className={styles.background}>
        <div className={styles.container}>
            <h1>Set Password</h1>

            <div className={styles.inputField}>
                <input type="password" value={password} onChange ={(e) => SetPassword(e.target.value)} placeholder="Password" />
            </div>

            <div className={styles.inputField}>
                <input type="password" value={confirmPassword} onChange ={(e) => SetConfirmPassword(e.target.value)}
                placeholder="Confirm Password" />
            </div>

            <button className={styles.submitButton} 
            onClick={handleSubmit}
            disabled={loading}> {loading ? "Submitting..." : "Submit"}</button>
        </div>
        </div>
    );
};

export default SetPassword;