import React, {useState } from "react";
import { useRouter } from "next/router";
import styles from "./Register.module.scss"
import Spinner from "../Spinner";


const Register: React.FC = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        userName: "",
        phoneNumber: "",
        email: "",
        dob: "",
        gender: "",
        location: "",
        isAbove18: false,
    });

    //Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        
        setFormData((prev) => ({
            ...prev,
            [name]: e.target instanceof HTMLInputElement && (e.target.type === "checkbox" || e.target.type === "radio")
                    ? e.target.checked
                    : value,
        }));
    };

    const handleDone = () => {
        if(!formData.isAbove18){
            alert("You must confirm you are above 18 to proceed");
            return;
        }
        setLoading(true);
        try{
            localStorage.setItem("registerData", JSON.stringify(formData));
            router.push("/set-password")
            setLoading(false);
        } catch (error) {
            console.error("Error saving user details: ", error)
            setLoading(false)
            return
        }
    };


    return (
        <div className={styles.background}>
        <div className={styles.container}>
            <h1 className={styles.heading}>Register</h1>
            {loading ? (
                <div className={styles.spinnerWrapper}>
                    <Spinner />
                    <p>Saving details...</p>
                </div>
            ): (
            <form>
                <div className={styles.inputField}>
                    <label>Name:</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} />
                </div>
                
                <div className={styles.inputField}>
                    <label>UserName:</label>
                    <input type="text" name="userName" value={formData.userName} onChange={handleChange} />
                </div>

                <div className={styles.inputField}>
                    <label>Phone Number:</label>
                    <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
                </div>

                <div className={styles.inputField}>
                    <label>Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} />
                </div>

                <div className={styles.inputField}>
                    <label>Date of Birth:</label>
                    <input type="date" name="dob" value={formData.dob} onChange={handleChange} />
                </div>

                <div className={styles.inputField}>
                    <label>Gender</label>
                    <select className={styles.selectField} name="gender" value={formData.gender} onChange={handleChange}>
                        <option value="">Select Gender:</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>

                <div className={styles.inputField}>
                    <label>Location:</label>
                    <input type="text" name="location" value={formData.location} onChange={handleChange} />
                </div>

                <div className={styles.inputField}>
                    <label>
                        <input
                            type="radio"
                            name="isAbove18"
                            checked={formData.isAbove18}
                            onChange={handleChange}
                            />
                        I confirm that I am above 18
                    </label>
                </div>

                <button type="button" onClick={handleDone} className={styles.submitButton}>
                    Done
                </button>
            </form>
            )};
        </div>
        </div>
    );
};

export default Register;